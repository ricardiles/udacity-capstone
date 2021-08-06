import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createTransaction, deleteTransaction, getTransaction, patchTransaction } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Transaction } from '../types/Transaction'

interface TransactionProps {
  auth: Auth
  history: History
}

interface TransactionState {
  transactions: Transaction[]
  newTransactionDescription: string
  newAmount: number
  status: string
  loadingTransactions: boolean
}

export class Transactions extends React.PureComponent<TransactionProps, TransactionState> {
  state: TransactionState = {
    transactions: [],
    newTransactionDescription: '',
    newAmount: 0,
    status: '',
    loadingTransactions: true
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTransactionDescription: event.target.value })
  }

  onEditButtonClick = (transactionId: string) => {
    this.props.history.push(`/transactions/${transactionId}/edit`)
  }

  onTransactionCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newTransaction = await createTransaction(this.props.auth.getIdToken(), {
        description: this.state.newTransactionDescription,
        amount: this.state.newAmount,
        status: this.state.status
      })
      this.setState({
        transactions: [...this.state.transactions, newTransaction],
        newTransactionDescription: ''
      })
    } catch {
      alert('Transaction creation failed')
    }
  }

  onTransactionDelete = async (transactionId: string) => {
    try {
      await deleteTransaction(this.props.auth.getIdToken(), transactionId)
      this.setState({
        transactions: this.state.transactions.filter(transaction => transaction.transactionId != transactionId)
      })
    } catch {
      alert('Transaction deletion failed')
    }
  }

  onTransactionCheck = async (pos: number) => {
    try {
      const transaction = this.state.transactions[pos]
      await patchTransaction(this.props.auth.getIdToken(), transaction.transactionId, {
        status: transaction.status
      })
      this.setState({
        transactions: update(this.state.transactions, {
          [pos]: { status: { $set: transaction.status } }
        })
      })
    } catch {
      alert('Transactions check failed')
    }
  }

  async componentDidMount() {
    try {
      const transactions = await getTransaction(this.props.auth.getIdToken())
      this.setState({
        transactions,
        loadingTransactions: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">TODOs</Header>

        {this.renderCreateTransactionInput()}

        {this.renderTransactions()}
      </div>
    )
  }

  renderCreateTransactionInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New transaction',
              onClick: this.onTransactionCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleDescriptionChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTransactions() {
    if (this.state.loadingTransactions) {
      return this.renderLoading()
    }

    return this.renderTransactionsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Transactions
        </Loader>
      </Grid.Row>
    )
  }

  renderTransactionsList() {
    return (
      <Grid padded>
        {this.state.transactions.map((transaction, pos) => {
          return (
            <Grid.Row key={transaction.transactionId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onTransactionCheck(pos)}
                  checked = {true}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {transaction.description}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(transaction.transactionId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTransactionDelete(transaction.transactionId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {transaction.attachmentUrl && (
                <Image src={transaction.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
