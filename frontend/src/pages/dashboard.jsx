import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const history = useHistory();
  const [quizDetails, setQuizDetails] = React.useState([]);
  const [name, setName] = React.useState('');
  const [deleted, setDeleted] = React.useState(false);
  const token = localStorage.getItem('token')

  // logout to login page
  const logOut = async event => {
    try {
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

  // display the quizzes on the dashboard
  const viewQuizzes = async event => {
    // reset setDeleted after a delete
    setDeleted(false);
    try {
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

  // update quizzies on dashboard and their details on first page load,
  // when quizzes are added and when deleted
  useEffect(() => {
    viewQuizzes();
  }, [name]);
  useEffect(() => {
    viewQuizzes();
    getQuizDetails()
  }, []);
  useEffect(() => {
    viewQuizzes();
    setDeleted(false);
    getQuizDetails()
  }, [deleted]);

  const getQuizDetails = () => {
    quizDetails.forEach(data => {
      fetch(`http://localhost:5005/admin/quiz/${data.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(result => {
            // set the number of questions and total time of quiz
            const NumOfQuestions = result.questions.length
            localStorage.setItem(`${data.id}`, NumOfQuestions)
            let quizLength = 0;
            const questions = result.questions
            questions.forEach(q => {
              quizLength += q.timeAllowed;
              console.log(quizLength)
            })
            localStorage.setItem(`${data.id}time`, quizLength)
          })
        }
      }).catch(error => {
        console.log('Error: ', error);
      })
    });
  }

  const newQuiz = async event => {
    try {
      event.preventDefault();
      // body updates to match name textarea
      const body = { name }
      const response = await fetch('http://localhost:5005/admin/quiz/new', {
        body: JSON.stringify(body),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      });
      if (response.status === 200) {
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
        <button id = "logOut" onClick = {logOut}>Log out</button>
      </div>
      <p>
        Welcome to the Dashboard!
      </p>
      <div>
        <input
          id = "newGameName"
          type= "text"
          onChange = {e => setName(e.target.value)}
          placeholder = "Enter Name of Game"
        />
        <button onClick = {newQuiz} id = "newGame">Create Game</button>
      </div>
      <div>
        {
          quizDetails.map((data, id) => (
            <DisplayQuiz
              onClick = {() => setDeleted(true)}
              key = {id}
              name = {data.name}
              id = {data.id}
              numOfQuestions = {localStorage.getItem(`${data.id}`)}
              quizTime = {localStorage.getItem(`${data.id}time`)}
            />
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

// components

function DisplayQuiz ({ name, id, onClick, numOfQuestions, quizTime }) {
  const token = localStorage.getItem('token')
  // each delete is specific to question ID
  const deleteQuiz = async event => {
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

  // starts the game and then fetches quiz data where session can be found
  const startGame = async event => {
    try {
      event.preventDefault();
      const response = await fetch(`http://localhost:5005/admin/quiz/${id}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      });
      if (response.status === 200) {
        console.log(response)
        fetch(`http://localhost:5005/admin/quiz/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + token
          },
        }).then(response => {
          if (response.status === 200) {
            response.json().then(data => {
              console.log(data)
            })
          }
        }).catch(error => {
          console.log('Error: ', error);
        })
      } else {
        alert('Invalid token')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const endGame = async event => {
    try {
      event.preventDefault();
      const response = await fetch(`http://localhost:5005/admin/quiz/${id}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      });
      if (response.status === 200) {
        console.log(response)
      } else {
        alert('Invalid token')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const saveQuizName = () => {
    localStorage.setItem('quizName', name);
  }
  return (
    <div style = {questionBox}>
      <div>
        <Link to = {`quiz/${id}`}>
          <button onClick = {saveQuizName}> Edit </button>
        </Link>
        <button onClick= {() => { onClick(); deleteQuiz() }} > Delete </button>
      </div>
      <p id = "quiz">Quiz Name: {name}</p>
      <div>Number of Questions: {numOfQuestions}</div>
      <div>Total Time: {quizTime}</div>
      <div>
        <button id = "start" onClick = {startGame} >Start Game</button>
        <Link to = {`quiz/${id}/end`}>
          <button id = "end" onClick = {endGame}>End Game</button>
        </Link>
      </div>
    </div>
  )
}

DisplayQuiz.propTypes = {
  name: PropTypes.string,
  id: PropTypes.number,
  onClick: PropTypes.func,
  numOfQuestions: PropTypes.string,
  quizTime: PropTypes.string
}

export default Dashboard;
