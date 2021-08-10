import * as React from 'react'
import { History } from 'history'
import Auth from '../auth/Auth'
import { patchTransaction } from '../api/transactions-api'
import {
  Form,
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react';
import Dropdown from 'react-dropdown';

enum UploadState {
  Status,
  Description,
  Amount
}


interface TransactionState {
  newTransactionDescription: string,
  newAmount: string,
  status: string,
  loadingTransactions: boolean
}

const options = [
  'Pending', 'Completed', 'Canceled'
];

interface EditTodoProps {
  match: {
    params: {
      transactionId: string
    }
  },
  location: any
  auth: Auth,
  history: History
}

interface EditTransactionState {
  transactions: any
  newTransactionDescription: string,
  newAmount: string,
  status: string,
  loadingTransactions: boolean
}

export class EditTransaction extends React.PureComponent<EditTodoProps, EditTransactionState> {
  state: EditTransactionState = {
    transactions: [],
    newTransactionDescription: this.props.location.state.description,
    newAmount: this.props.location.state.amount,
    status: this.props.location.state.detail,
    loadingTransactions: true
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTransactionDescription: event.target.value })
  }

  handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newAmount: event.target.value })
  }

  handleStatusChange = (event:any) => {
    this.setState({ status: event.value})
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.status) {
        alert('Status should be selected')
        return
      }

      if (!this.state.newAmount){
        this.state.newAmount = this.props.location.state.amount
      }

      if (!this.state.newTransactionDescription){
        this.state.newTransactionDescription = this.props.location.state.newTransactionDescription
      }

      const updateData = {
        status: this.state.status,
        amount: this.state.newAmount,
        description: this.state.newTransactionDescription
      }
      const updateTransaction = await patchTransaction(this.props.auth.getIdToken(), this.props.match.params.transactionId, updateData);
      alert('Transaction updated');
      this.props.history.push({
        pathname: `/`,
      })
      
    } catch (e) {
      alert('Could not upload a file' + e.message);
    } 
  }

  render() {
    return (
      <div>
        <h1>Update Transaction</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Description</label>
            <Input
              fluid
              defaultValue={this.props.location.state.description} 
              onChange={this.handleDescriptionChange}
            />
            <label>Amount</label>
            <Input
              fluid
              defaultValue={this.props.location.state.amount} 
              onChange={this.handleAmountChange}
            />
            <label>Status</label>
            <Dropdown 
                options={options} 
                value={this.props.location.state.detail} 
                onChange={this.handleStatusChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        
        <Button
          type="submit"
        >
          Update
        </Button>
      </div>
    )
  }
}
