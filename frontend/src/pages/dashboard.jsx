// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
/* eslint-disable react/prop-types */

const Dashboard = () => {
  const history = useHistory();
  const [quizDetails, setQuizDetails] = React.useState([]);
  const [name, setName] = React.useState('');
  const [deleted, setDeleted] = React.useState(false);

  const logOut = async event => {
    try {
      const token = localStorage.getItem('token')
      event.preventDefault();
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
        localStorage.removeItem('token')
      } else {
        alert('Invalid token')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const viewQuizzes = async event => {
    setDeleted(false);
    try {
      const token = localStorage.getItem('token')
      // event.preventDefault();
      console.log(token)
      const response = await fetch('http://localhost:5005/admin/quiz', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      });
      if (response.status === 200) {
        response.json().then(result => {
          setQuizDetails(result.quizzes)
        })
      } else {
        alert('Invalid token')
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    viewQuizzes();
  }, [name]);
  useEffect(() => {
    viewQuizzes();
    setDeleted(false);
  }, [deleted]);

  const newQuiz = async event => {
    const token = localStorage.getItem('token')
    console.log(name)
    try {
      event.preventDefault();
      const body = { name }
      const response = await fetch('http://localhost:5005/admin/quiz/new', {
        body: JSON.stringify(body),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      });
      console.log(JSON.stringify(body))
      if (response.status === 200) {
        console.log('successfully added')
        setName('')
        document.getElementById('newGameName').value = '';
      } else if (response.status === 400) {
        alert('Invalid input')
      } else if (response.status === 403) {
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
      <div>
        <input
          id = "newGameName"
          type= "text"
          onChange = {e => setName(e.target.value)}
          placeholder = "Enter Name of Game"
        />
        <button onClick = {newQuiz}>Create Game</button>
      </div>
      <div>
        {
          quizDetails.map((data, id) => (
            <DisplayQuiz onClick = {() => setDeleted(true)} key = {id} name = {data.name} id = {data.id}/>
          ))
        }
      </div>
    </div>
  )
}
const questionBox = {
  width: '70%',
  margin: 'auto',
  padding: '10px',
  border: '2px solid black'
}

function DisplayQuiz ({ name, id, onClick }) {
  const deleteQuiz = async event => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5005/admin/quiz/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      });
      if (response.status === 200) {
        console.log('successfully deleted')
      } else if (response.status === 400) {
        alert('Invalid input')
      } else if (response.status === 403) {
        alert('Invalid token')
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div style = {questionBox}>
      <div>
        <button> Edit </button>
        <button onClick= {() => { onClick(); deleteQuiz() }} > Delete </button>
      </div>
      <p>Quiz Name: {name} + {id} </p>
    </div>
  )
}

DisplayQuiz.PropTypes = {
  name: PropTypes.string
}

/*
const testQuiz =
[{ id: 1, name: 'A' },
  { id: 2, name: 'B' }]

function QuizDiv (id, name) {
  return (
    <div>
      <p>{id}</p>
      <p>{name}</p>
    </div>
  )
}
*/

export default Dashboard;
