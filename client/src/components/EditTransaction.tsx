import * as React from 'react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile } from '../api/transactions-api'
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
  NoStatus,
  Status
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
  auth: Auth
}

interface EditTransactionState {
  transactions: any
  newTransactionDescription: string,
  newAmount: string,
  status: UploadState,
  loadingTransactions: boolean
}

export class EditTransaction extends React.PureComponent<EditTodoProps, EditTransactionState> {
  state: EditTransactionState = {
    transactions: [],
    newTransactionDescription: '',
    newAmount: '',
    status: UploadState.Status,
    loadingTransactions: true
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.status) {
        alert('Status should be selected')
        return
      }

      this.setUploadState(UploadState.Status)
      //const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.transactionId)

      //this.setUploadState(UploadState.UploadingFile)
      //await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!');
      
    } catch {
      alert('Could not upload a file')
    } finally {
      this.setUploadState(UploadState.Status)
    }
  }

  setUploadState(status: UploadState) {
    this.setState({
      status
    })
  }

  render() {
    return (
      <div>
        <h1>Update Transaction</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Status</label>
            <Dropdown 
                options={options} 
                value={this.props.location.state.detail} 
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
