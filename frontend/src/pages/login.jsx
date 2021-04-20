import { Link, useHistory } from 'react-router-dom';
import React from 'react';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const history = useHistory();

  const submit = async event => {
    try {
      event.preventDefault();
      const body = { email, password }
      const response = await fetch('http://localhost:5005/admin/auth/login', {
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
        alert('Invalid username or password')
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <form>
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
        <Link to="/dashboard">
          <button onClick={submit} >Submit</button>
        </Link>
      </form>
        <Link to="/register">
          <button>Register</button>
        </Link>
    </div>
  )
}

export default Login;
