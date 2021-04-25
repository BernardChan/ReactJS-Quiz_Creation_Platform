import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const Quiz = () => {
  const param = useParams();
  const [quizDetails, setQuizDetails] = React.useState({});
  const [quizQuestions, setQuizQuestions] = React.useState([]);
  const [questionTitle, setQuestionTitle] = React.useState('')
  const token = localStorage.getItem('token')

  const getQuizDetails = async event => {
    try {
      const quizID = param.id;
      const response = await fetch(`http://localhost:5005/admin/quiz/${quizID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      });
      if (response.status === 200) {
        response.json().then(result => {
          // update use states with quiz metadata and questions
          setQuizDetails(result);
          setQuizQuestions(result.questions);
        })
      } else {
        alert('Invalid token')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const updateQuiz = async event => {
    try {
      const quizID = param.id;
      const body = quizDetails
      const response = await fetch(`http://localhost:5005/admin/quiz/${quizID}`, {
        body: JSON.stringify(body),
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      });
      if (response.status === 200) {
        console.log('success')
      } else {
        alert('Invalid token')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const addQuestions = () => {
    // custom question body
    const newQuestionBody = {
      title: questionTitle,
      questionType: 'single',
      timeAllowed: 0,
      pointsWorth: 0,
      options: []
    }
    // change the quiz details body to include the new question
    const newQuizQuestions = [...quizQuestions];
    newQuizQuestions.push(newQuestionBody);
    setQuizQuestions(newQuizQuestions);
    quizDetails.questions = newQuizQuestions;
    document.getElementById('newQuestion').value = ''
  }

  // remove question from quiz
  const removeQuestion = (index) => {
    const newQuizQuestions = [...quizQuestions];
    newQuizQuestions.splice(index, 1);
    setQuizQuestions(newQuizQuestions);
    quizDetails.questions = newQuizQuestions;
  }

  // update quiz when the questions change
  useEffect(() => {
    updateQuiz();
    localStorage.setItem(`${param.id}`, quizQuestions.length)
    let quizLength = 0;
    quizQuestions.forEach(q => {
      quizLength += q.timeAllowed;
    })
    localStorage.setItem(`${param.id}time`, quizLength)
  }, [quizQuestions])

  useEffect(() => {
    getQuizDetails();
  }, []);

  return (
    <div>
      <Link to = "/dashboard">
        <p>
          <button> Return to Dashboard </button>
        </p>
      </Link>
      <p>
        Quiz Name: {quizDetails.name}
      </p>
      <div>
        <input
            id = "newQuestion"
            type= "text"
            onChange = {e => setQuestionTitle(e.target.value)}
            placeholder = "Enter Question"
          />
        <button onClick = {addQuestions} >
          Add Questions
        </button>
      </div>
      <div>
        {
          quizQuestions.map((data, id) => (
            <Questions
              key = {id}
              onClick = {() => removeQuestion(quizQuestions.indexOf(data))}
              title = {data.title}
              timeAllowed = {data.timeAllowed}
              pointsWorth = {data.pointsWorth}
              index = {quizQuestions.indexOf(data) + 1}
              id = {param.id}
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

function Questions ({ title, timeAllowed, pointsWorth, index, onClick, id }) {
  return (
    <div style = {questionBox}>
      <div>
        <Link to = {`/quiz/${id}/${index}`}>
          <button> Edit </button>
        </Link>
        <button onClick = { onClick }> Delete </button>
      </div>
      <div> Question {index}: {title} </div>
      <div> Time Allowed: {timeAllowed} </div>
      <div> Points: {pointsWorth} </div>
    </div>
  )
}

Questions.propTypes = {
  index: PropTypes.number,
  title: PropTypes.string,
  timeAllowed: PropTypes.number,
  pointsWorth: PropTypes.number,
  onClick: PropTypes.func,
  id: PropTypes.string
}

export default Quiz;
