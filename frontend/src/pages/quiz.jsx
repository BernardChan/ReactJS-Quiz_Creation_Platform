import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
/* eslint-disable react/prop-types */

const Quiz = () => {
  const param = useParams();
  // const history = useHistory();
  const [quizDetails, setQuizDetails] = React.useState({});
  const [quizQuestions, setQuizQuestions] = React.useState([]);
  const [questionTitle, setQuestionTitle] = React.useState('')

  const getQuizDetails = async event => {
    try {
      const token = localStorage.getItem('token')
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
          /* / debug
          console.log(result)
          result.questions = ['mums']
          console.log(result)
          */
          setQuizDetails(result);
          setQuizQuestions(result.questions);
          console.log(quizDetails)
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
      const token = localStorage.getItem('token')
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
        response.json().then(result => {
          console.log('success')
          console.log(quizDetails)
          console.log(body)
          console.log(JSON.stringify(body))
        })
      } else {
        alert('Invalid token')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const addQuestions = () => {
    console.log(questionTitle)
    const newQuestionBody = {
      title: questionTitle
    }
    console.log(newQuestionBody)
    // change the quiz details body to include the new question
    const newQuizQuestions = [...quizQuestions];
    newQuizQuestions.push(newQuestionBody);
    console.log(newQuizQuestions)
    setQuizQuestions(newQuizQuestions);
    console.log(quizQuestions)
    quizDetails.questions = newQuizQuestions;
    console.log(quizDetails)
    document.getElementById('newQuestion').value = ''
    // updateQuiz()
  }

  const removeQuestion = (index) => {
    const newQuizQuestions = [...quizQuestions];
    newQuizQuestions.splice(index, 1);
    setQuizQuestions(newQuizQuestions);
    quizDetails.questions = newQuizQuestions;
    // updateQuiz()
  }

  useEffect(() => {
    updateQuiz();
  }, [quizQuestions])
  useEffect(() => {
    getQuizDetails();
    console.log(quizQuestions)
  }, []);
  console.log(quizDetails)

  return (
    <div>
      <Link to = "/dashboard">
        <button > Return to Dashboard </button>
      </Link>
      <div>
        {quizDetails.name}
      </div>
      <div>
        Questions
      </div>
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

function Questions ({ title, index, onClick, id }) {
  return (
    <div style = {questionBox}>
      <div>
        <Link to = {`/quiz/${id}/${index}`}>
          <button> Edit </button>
        </Link>
        <button onClick = { onClick }> Delete </button>
      </div>
      Question {index}: {title}
    </div>
  )
}

Questions.propTypes = {
  index: PropTypes.number,
  title: PropTypes.string
}

export default Quiz;
