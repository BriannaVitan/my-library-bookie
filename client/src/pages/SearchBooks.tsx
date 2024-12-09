
// import React, { useState } from 'react';  
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';  
import { useMutation } from '@apollo/client';  
import { SAVE_BOOK, RATE_BOOK } from '../utils/mutations';  
import Auth from '../utils/auth';  
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';  
import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';
import StarRating from '../components/StarRating/StarRating';  
// import { Book, GoogleBookResponse, BookType, SavedBookIds Rating } from '../models/Book';
import { Book, Rating } from '../models/Book';
import type { GoogleAPIBook } from '../models/GoogleAPIBook'; 

  
const SearchBooks = () => {  
  const [searchInput, setSearchInput] = useState('');  
  const [searchedBooks, setSearchedBooks] = useState<Book[]>([]);  
  const [loading, setLoading] = useState(false);  
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

   // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // Set up mutations  
  const [saveBook] = useMutation(SAVE_BOOK);  
  // const [rateBook] = useMutation(RATE_BOOK);  
  
  // Handle form submission  
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchInput) {
      throw new Error('Search input missing!');
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book: GoogleAPIBook) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        link: book.volumeInfo.infoLink,  
          ratings: [], // Initialize ratings  
        averageRating: 0,  
            totalRatings: 0,  
          }));  
     

  //  try {  
  //   setLoading(true);  
  //   const response = await fetch(  
  //     `https://www.googleapis.com/books/v1/volumes?q=${searchInput}`  
  //   );  
  
  //   if (!response.ok) {  
  //     throw new Error('Something went wrong!');  
  //   }  
  
  //   const { items } = await response.json();  
  
  //   const bookData = items.map((book: GoogleBookResponse) => ({  
  //     bookId: book.id,  
  //     authors: book.volumeInfo.authors || ['No author to display'],  
  //     title: book.volumeInfo.title,  
  //     description: book.volumeInfo.description,  
  //     image: book.volumeInfo.imageLinks?.thumbnail || '',  
  //     link: book.volumeInfo.infoLink,  
  //     ratings: [], // Initialize ratings  
  //     averageRating: 0,  
  //     totalRatings: 0,  
  //   }));  
  
    setSearchedBooks(bookData);  
    setSearchInput('');  
    return;
   } catch (err) {  
    console.error(err);  
  //  } finally {  
  //   setLoading(false);  
   }  
  };  
  
  // Handle saving a book  
  const handleSaveBook = async (bookId: string) => {  
    const bookToSave: Book = searchedBooks.find((book) => book.bookId === bookId)!;

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;
  
    if (!token) {
      throw new Error('token is missing!');
    }

    try {
      // saveBook mutation takes in mutiple variables directly
      // this means that to pass the variables, must use the below syntax
      console.log(JSON.stringify(bookToSave));
      const response = await saveBook({variables: {...bookToSave}});

      if (!response) {
        throw new Error('something went wrong!');
      }

      // if book successfully saves to user's account, save book id to state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
      return;
    } catch (err) {
      console.error(err);
    }
  };
  //  if (!token || !bookToSave) {  
  //   return;  
  //  }  
  
  //  try {  
  //   await saveBook({  
  //     variables: { bookData: bookToSave },  
  //   });  
  
  //   setSavedBookIds([...savedBookIds, bookToSave.bookId]);  
  //  } catch (err) {  
  //   console.error(err);  
  //  }  
  // };  
  
  // Handle rating a book
  const handleRateBook = async (bookId: string, rating: number) => {
    const [rateBook] = useMutation(RATE_BOOK);
   try {
    const { data } = await rateBook({
      variables: { bookId, rating },
    });

    const updatedBook = data.rateBook;

//     console.log('Book rated successfully:', data.rateBook);
//   } catch (error) {
//     console.error('Error rating book:', error);
//   }
// };
    // Update the book in the local state
    setSearchedBooks((prevBooks) =>
      prevBooks.map((book) =>
       book.bookId === bookId ? { ...book, ...updatedBook } : book
      )
    );
   } catch (err) {
    console.error(err);
   }
  };
  
  return (  
   <div className="fade-in">  
    <div className="search-header text-light bg-dark p-4 p-md-5">  
      <Container>  
       <h1 className="mb-4">Search for Books!</h1>  
       <Form onSubmit={handleFormSubmit}>  
        <Row className="g-3">  
          <Col xs={12} md={8}>  
           <Form.Control  
            name="searchInput"  
            value={searchInput}  
            onChange={(e) => setSearchInput(e.target.value)}  
            type="text"  
            size="lg"  
            placeholder="Search for a book"  
            className="w-100"  
           />  
          </Col>  
          <Col xs={12} md={4}>  
           <Button  
            type="submit"  
            variant="success"  
            size="lg"  
            className="w-100"  
            disabled={loading}  
           >  
            {loading ? 'Searching...' : 'Submit Search'}  
           </Button>  
          </Col>  
        </Row>  
       </Form>  
      </Container>  
    </div>  
  
    <Container className="py-4">  
      {loading ? (  
       <LoadingSpinner />  
      ) : (  
       <>  
        <h2 className="mb-4">  
          {searchedBooks.length  
           ? `Viewing ${searchedBooks.length} results:`  
           : 'Search for a book to begin'}  
        </h2>  
        <Row className="g-4">  
          {searchedBooks.map((book) => {  
           const userRating = Auth.loggedIn()  
            ? book.ratings.find((r: Rating) => r.userId === Auth.getProfile()?.data._id)?.rating || 0  
            : 0;  
  
           return (  
            <Col xs={12} md={6} lg={4} key={book.bookId}>  
              <Card className="h-100 book-card">  
               {book.image && (  
                <div className="card-img-container">  
                  <Card.Img  
                   src={book.image}  
                   alt={`The cover for ${book.title}`}  
                   variant="top"  
                   className="book-cover"  
                  />  
                </div>  
               )}  
               <Card.Body className="d-flex flex-column">  
                <Card.Title className="h5 mb-2">{book.title}</Card.Title>  
                <p className="small mb-2">Authors: {book.authors.join(', ')}</p>  
                <Card.Text className="book-description">  
                  {book.description}  
                </Card.Text>  
                <div className="mt-auto">  
                  {Auth.loggedIn() && (  
                   <>  
                    <StarRating  
                      initialRating={userRating}  
                      onRatingChange={(rating) => handleRateBook(book.bookId, rating)}  
                    />  
                    <span className="rating-count ms-2">  
                      ({book.totalRatings} ratings)  
                    </span>  
                   </>  
                  )}  
                  {/* Save Book Button */}  
                  {Auth.loggedIn() && (  
                   <Button  
                    disabled={savedBookIds.includes(book.bookId)}  
                    className="w-100 mt-2"  
                    variant={savedBookIds.includes(book.bookId) ? 'secondary' : 'primary'}  
                    onClick={() => handleSaveBook(book.bookId)}  
                   >  
                    {savedBookIds.includes(book.bookId) ? 'Saved!' : 'Save Book'}  
                   </Button>  
                  )}  
                </div>  
               </Card.Body>  
              </Card>  
            </Col>  
           );  
          })}  
        </Row>  
       </>  
      )}  
    </Container>  
   </div>  
  );  
};  
  
export default SearchBooks;