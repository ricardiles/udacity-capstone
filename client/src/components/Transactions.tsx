import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Select,
  Image,
  Loader
} from 'semantic-ui-react'

import { createTransaction, deleteTransaction, getTransaction, patchTransaction } from '../api/transactions-api'
import Auth from '../auth/Auth'
import { Transaction } from '../types/Transaction'

const options = [
  'one', 'two', 'three'
];
const defaultOption = options[0];

interface TransactionProps {
  auth: Auth,
  history: History
}

interface TransactionState {
  transactions: Transaction[],
  newTransactionDescription: string,
  newAmount: string,
  status: string,
  loadingTransactions: boolean
}

export class Transactions extends React.PureComponent<TransactionProps, TransactionState> {
  state: TransactionState = {
    transactions: [],
    newTransactionDescription: '',
    newAmount: '',
    status: '',
    loadingTransactions: true
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTransactionDescription: event.target.value })
  }

  handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newAmount: event.target.value})
  }

  handleStatusChange = (event:any) => {
    this.setState({ status: event.value})
  }

  onEditButtonClick = (transactionId: string) => {
    this.props.history.push(`/transactions/${transactionId}/edit`)
  }

  onTransactionCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newTransaction = await createTransaction(this.props.auth.getIdToken(), {
        description: this.state.newTransactionDescription,
        amount: Number(this.state.newAmount),
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
      console.log(e);
      alert('Failed to fetch transactions')
    }
  }

  render() {
    return (
      <div>
        <Header as="h2">New Transaction</Header>

        {this.renderCreateTransactionInput()}

        <Header as="h1">Transactions</Header>
        {this.renderTransactions()}
      </div>
    )
  }

  renderCreateTransactionInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
              fluid
              actionPosition="left"
              placeholder="Amount of transaction"
              onChange={this.handleAmountChange}
          />
          <Dropdown 
              options={options} 
              onChange={this.handleStatusChange}
              value={defaultOption} 
              placeholder="Select an option" 
          />
          <Input
            action={{
              color: 'blue',
              labelPosition: 'left',
              icon: 'add',
              content: 'Add',
              onClick: this.onTransactionCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Description of transaction..."
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
    const date = new Date();
    date.setDate(date.getDate() + 7);

    return dateFormat(date, 'yyyy-mm-dd');
  }
}
