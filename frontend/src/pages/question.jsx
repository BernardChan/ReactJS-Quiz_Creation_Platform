import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const Question = () => {
  const [title, setTitle] = React.useState('')
  const [result, setResult] = React.useState([]);
  const [options, setOptions] = React.useState([]);
  const [time, setTime] = React.useState();
  const [points, setPoints] = React.useState();
  const [type, setType] = React.useState();

  const param = useParams();
  const token = localStorage.getItem('token')

  const getQuestionDetails = async event => {
    try {
      // get parameters from use params
      const quizID = param.id;
      const questionID = param.qid;

      const response = await fetch(`http://localhost:5005/admin/quiz/${quizID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      });
      if (response.status === 200) {
        response.json().then(result => {
          // set the usestates with the question details
          setResult(result)
          const questionDetails = result.questions[questionID - 1]
          setType(questionDetails.questionType)
          setTitle(questionDetails.title)
          setTime(questionDetails.timeAllowed)
          setPoints(questionDetails.pointsWorth)
          setOptions(questionDetails.options)
        })
      } else {
        alert('Invalid token')
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getQuestionDetails();
  }, [])

  // cannot add more than 6 options
  const validAddOption = () => {
    if (options.length < 6) {
      addOption()
    } else {
      alert('Cannot have more than 6 options!')
    }
  }

  const addOption = () => {
    // body for a question option
    const newOption = {
      answer: '',
      timeLimit: 0,
      points: 0,
      correct: false
    }
    console.log(newOption)
    // change the quiz details body to include the new question
    const newOptions = [...options];
    newOptions.push(newOption);
    setOptions(newOptions);
    console.log(options)
  }

  const removeQuestion = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  }

  // check conditions for if update is valid or not
  const validUpdate = () => {
    if (options.length >= 2 && options.length <= 6) {
      // find how many are correct
      let totalCorrect = 0;
      options.forEach(data => {
        if (data.correct === true) {
          totalCorrect += 1;
        }
      })
      if (type === 'single') {
        if (totalCorrect === 1) {
          updateButton();
        } else {
          alert('Only one answer can be correct')
        }
      } else if (type === 'multiple') {
        if (totalCorrect > 1) {
          updateButton();
        } else {
          alert('More than one answer must be correct')
        }
      }
    } else {
      alert('Not enough options');
    }
  }

  const updateButton = async event => {
    const quizID = param.id;
    const questionID = param.qid;
    const newResults = result;
    // for a given question index, set its metadata
    newResults.questions[questionID - 1].title = title;
    newResults.questions[questionID - 1].questionType = type;
    newResults.questions[questionID - 1].timeAllowed = time;
    newResults.questions[questionID - 1].pointsWorth = points;
    newResults.questions[questionID - 1].options = options;
    setResult(newResults)

    try {
      const response = await fetch(`http://localhost:5005/admin/quiz/${quizID}`, {
        body: JSON.stringify(result),
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      });
      if (response.status === 200) {
        alert('Successful Update!')
      } else {
        alert('Invalid token')
      }
    } catch (err) {
      console.log(err)
    }
  }

  // functions that update question details below //

  const updateOptions = (index, string) => {
    const newOptions = [...options];
    newOptions[index].answer = string;
    setOptions(newOptions)
    console.log(options)
  }

  const updateTime = (string) => {
    setTime(parseInt(string));
    console.log(options)
  }

  const updatePoints = (string) => {
    setPoints(parseInt(string));
    console.log(options)
  }

  const updateCorrect = (index, result) => {
    const newOptions = [...options];
    newOptions[index].correct = result;
    setOptions(newOptions)
    console.log(options)
  }

  const removeOption = (index) => {
    console.log(index)
    const newOptions = [...options]
    newOptions.splice(index - 1, 1)
    setOptions(newOptions)
    console.log(options)
  }

  return (
    <div>
      <Link to = {`/quiz/${param.id}`}>
        <p>
          <button> Return to Questions </button>
        </p>
      </Link>
      <div>
        <div>
          Question {param.qid}
        </div>
        <textarea
          id = 'questionTitle'
          defaultValue = {title}
          onChange = {e => setTitle(e.target.value)}
        />
        <div>
          <label> Time Limit: </label>
          <input
            defaultValue = {time}
            onChange = {e => updateTime(e.target.value)}
          />
        <div>
          <label> Points worth: </label>
          <input
            defaultValue = {points}
            onChange = {e => updatePoints(e.target.value)}
          />
        </div>
        <div>
          <label> Question Type: </label>
            <select
              value = {type}
              onChange = {e => setType(e.target.value)}
            >
              <option value = 'single'> Single Choice </option>
              <option value = 'multiple'> Multiple Choice </option>
            </select>
        </div>
      </div>
          <br></br>
          <button onClick = {validAddOption} >Add Option</button>
        <div>
          {
          options.map((data, id) => (
            <Options
              key = {id}
              onClick = {() => removeQuestion(options.indexOf(data))}
              index = {options.indexOf(data)}
              title = {data.answer}
              timeLimit = {data.timeLimit}
              points = {data.points}
              correct = {data.correct}
              setOption = {updateOptions}
              setCorrect = {updateCorrect}
              deleteOption = {removeOption}
            />
          ))
        }
        </div>
        <p>
          <button onClick = {validUpdate}> Update </button>
        </p>
      </div>
    </div>
  )
}

function Options ({ title, index, onClick, id, timeLimit, points, correct, setOption, setCorrect, deleteOption }) {
  return (
    <div>
      <br></br>
      <div> Option {index + 1} </div>
      <button onClick = {() => deleteOption(index)} > Delete option </button>
      <div>
        <textarea
          defaultValue = {title}
          onChange = {e => setOption(index, e.target.value)}
        />
      </div>
      <div>
        <label> Correct answer? </label>
        <input
          type = 'checkbox'
          defaultChecked = {correct}
          onChange = {e => setCorrect(index, e.target.checked)}
        />
      </div>
    </div>
  )
}

Options.propTypes = {
  title: PropTypes.string,
  index: PropTypes.number,
  onClick: PropTypes.func,
  id: PropTypes.number,
  correct: PropTypes.bool,
  timeLimit: PropTypes.number,
  points: PropTypes.number,
  setOption: PropTypes.func,
  setCorrect: PropTypes.func,
  deleteOption: PropTypes.func
}

export default Question;
