import { Link, useHistory } from 'react-router-dom';
import React from 'react';

const Register = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const history = useHistory();

  const submit = async event => {
    try {
      event.preventDefault();
      const body = { email, password, name }
      const response = await fetch('http://localhost:5005/admin/auth/register', {
        body: JSON.stringify(body),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        history.push('/dashboard')
        response.json().then(result => {
          localStorage.setItem('token', result.token)
        })
      } else {
        alert('Invalid input')
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <form>
      <div>
        <label htmlFor = "name">
          Name:
        </label>
        <input
          type="text"
          id="name"
          onChange = {e => setName(e.target.value)}
          />
      </div>
      <div>
        <label htmlFor = "email">
          Email:
        </label>
        <input
          type="text"
          id="email"
          onChange = {e => setEmail(e.target.value)}
          />
      </div>
      <div>
        <label htmlFor = "password">
          Password:
        </label>
        <input
          type="text"
          id="password"
          onChange = {e => setPassword(e.target.value)}
          />
      </div>
      <div>
        <Link to="/dashboard">
          <button onClick = {submit} >Submit</button>
        </Link>
      </div>
      <div>
        <Link to ="/">
          <button>Return to Log In</button>
        </Link>
      </div>
    </form>
  )
}

export default Register;
