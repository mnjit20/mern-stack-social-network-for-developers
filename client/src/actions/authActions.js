import axios from 'axios';
import { TEST_DISPATCH } from './types';

//Register user
export const registerUser = userData => dispatch => {

  axios.post('/api/users/register', newUser)
    .then(res => console.log(res.data))
    .catch(err => this.setState({ errors: err.response.data }));

  console.log('new user submitted form', newUser);

  // return {
  //   type: TEST_DISPATCH,
  //   payload: userData
  // };

}