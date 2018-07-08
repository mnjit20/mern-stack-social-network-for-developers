import axios from 'axios';
import { GET_ERRORS } from './types';

//Register user
export const registerUser = userData => dispatch => {

  axios.post('/api/users/register', userData)
    .then(res => console.log(res.data))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );

  console.log('new user submitted form', userData);

  // return {
  //   type: TEST_DISPATCH,
  //   payload: userData
  // };

}