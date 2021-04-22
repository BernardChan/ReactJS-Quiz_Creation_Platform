import React from 'react';
import { useParams, Link } from 'react-router-dom';

const question = () => {
  const params = useParams();
  return (
    <div>
      <Link to = {`/quiz/${params.id}`}>
        <button> Return to Questions </button>
      </Link>
      <div>
        Question {params.qid}
      </div>
    </div>
  )
}

export default question;
