import React, {Component, Fragment} from 'react';
import axios from 'axios';
import {userService} from "../Services/UserService";
import {CredentialsModel} from "@pavo/shared-services-shared/src";
import {api_url} from "../environment";

interface AssignUserState {
    assignee: string;
    users: any[];
    credentials: CredentialsModel;
}

class AssignUser extends Component<any, AssignUserState> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      assignee: '',
      users: [],
      credentials: null,
    };
  }

  assign(value: string) {
    this.setState({
      assignee: value,
    });
  }

  submit() {
    this.props.assign(this.state.assignee);

    this.setState({
      assignee: '',
    });
  }

  async componentDidMount() {
    const users = (await axios.get(`${api_url}/user/getAllUsers`, {
        headers: { 'Authorization':  userService.getCredentials().token}
    })).data;

    this.setState({
        users,
        credentials: userService.getCredentials(),
        assignee: users[0]._id,
    });
  }

  render() {
    if (!userService.isAuthenticated()) return null;
    else if (userService.hasRole("Admin")) return null;
    return (
      <Fragment>
        <div className="form-group text-center">
          <label>Assignee:</label>
          <select className="form-control" id="exampleSelect1"
            onChange={(e) => {this.assign(e.target.value)}}>
          {this.state.users === null && <p>Loading users... </p>}
            {
             this.state.users && this.state.users.map(user => (
                <option value={user._id} >{user.firstName} {user.lastName}</option>
             ))
            }
          </select>
        </div>
        <button
          className="btn btn-success"
          onClick={() => {this.submit()}}>
          Assign
        </button>
        <hr className="my-4" />
      </Fragment>
    )
  }
}

export default AssignUser;
