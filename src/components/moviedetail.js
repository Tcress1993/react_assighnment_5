import React, { useEffect } from 'react';
import { fetchMovie , submitReview} from '../actions/movieActions';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Image, Form } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom'; // Import useParams
import { set } from 'date-fns';

const MovieDetail = () => {
  const dispatch = useDispatch();
  const { movieId } = useParams(); // Get movieId from URL parameters
  const [review, setReview] = React.useState('');
  const [rating, setRating] = React.useState(1); // Default rating is 1
  const selectedMovie = useSelector(state => state.movie.selectedMovie);
  const loading = useSelector(state => state.movie.loading); // Assuming you have a loading state in your reducer
  const error = useSelector(state => state.movie.error); // Assuming you have an error state in your reducer
  console.log(selectedMovie);

  useEffect(() => {
    dispatch(fetchMovie(movieId));
  }, [dispatch, movieId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitReview({movieId, review, rating}))
      .then(() => {
        alert("Review submitted successfully!");
        setReview(''); // Clear the review input after submission
        setRating(1); // Clear the rating after submission and set it to default value 1
        dispatch(fetchMovie(movieId)); // Fetch the movie again to get the updated reviews 
      })
      .catch((err) =>{
        console.error(err);
        alert("Error submitting review. Please try again.");
      });
  };

  const DetailInfo = () => {
    if (loading) {
      return <div>Loading....</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!selectedMovie) {
      return <div>No movie data available.</div>;
    }

    return (
      <Card className="bg-dark text-dark p-4 rounded">
        <Card.Header>Movie Detail</Card.Header>
        <Card.Body>
          <Image className="image" src={selectedMovie.imageUrl} thumbnail />
        </Card.Body>
        <ListGroup>
          <ListGroupItem>{selectedMovie.title}</ListGroupItem>
          <ListGroupItem>
            {console.log(selectedMovie.actors)}
            {selectedMovie.actors.map((actor,i) => (
              <p key={i}>
                <b>{actor.actorName}</b> {actor.characterName}
              </p>
            ))}
          </ListGroupItem>
          <ListGroupItem>
            <h4>
              <BsStarFill /> {selectedMovie.avgRating}
            </h4>
          </ListGroupItem>
        </ListGroup>
        <Card.Body>
          {!selectedMovie.reviews || (selectedMovie.reviews.length === 0 )? (
            <p>No reviews available.</p>
          ) : (
            selectedMovie.reviews.map((review, i) => (
              <p key={i}>
                <b>{review.username}</b>&nbsp; {review.review} &nbsp; <BsStarFill />{' '}
                {review.rating}
              </p>
            ))
          )}
          {/* {selectedMovie.reviews.map((review, i) => (
             <p key={i}>
               <b>{review.username}</b>&nbsp; {review.review} &nbsp; <BsStarFill />{' '}
               {review.rating}
             </p>
           ))} */}
        </Card.Body>
        <Card.Body>
          <h5>Add a Review</h5>
          <Form onSubmit = {handleSubmit}>
            <Form.Group controlId="reviewText">
              <Form.label>Review</Form.label>
              <Form.Control as="textarea" rows={3} value={review} onChange={(e) => setReview(e.target.value)} required/>
            </Form.Group>
            <Form.Group controlId = "Rating Scale">
              <Form.Label>Rating</Form.Label>
              <Form.Control as="select" value={rating} onChange={(e)=> setRating(Number(e.target.value))} required>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    );
  };

  return <DetailInfo />;
};


export default MovieDetail;