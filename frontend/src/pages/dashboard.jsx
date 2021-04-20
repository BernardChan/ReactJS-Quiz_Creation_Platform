// import { Link } from 'react-router-dom';
import React from 'react';
import { useHistory } from 'react-router';

const Dashboard = () => {
  const history = useHistory();

  const logOut = async event => {
    try {
      event.preventDefault();
      const token = localStorage.getItem('token')
      console.log(token)
      const response = await fetch('http://localhost:5005/admin/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      });
      if (response.status === 200) {
        history.push('')
        // delete the token when logged out
        localStorage.setItem('token', '')
      } else {
        alert('Invalid token')
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div>
      <div>
        <button onClick = {logOut}>Log out</button>
      </div>
      <div>
        Welcome to Dashboard
      </div>
    </div>
  )
}

export default Dashboard;
