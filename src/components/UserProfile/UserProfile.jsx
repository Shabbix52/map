import { React, useState, useEffect } from 'react'
import './UserProfile.css'
import UserIcon from '../../assets/images/Icon.png'
import { useNavigate, useLocation } from 'react-router-dom'
import { checkout, getUser, fetchBook, fetchAllBooks } from '../../services/api'
import { showErrorToast, showSuccessToast } from '../../services/utils'
import Book from '../Book/Book'

function UserProfile() {

    const navigate = useNavigate()
    const location = useLocation()                   
     
    const [books, setBooks] = useState(null)  

    const accessToken = localStorage.getItem("myfAccessToken")
    if (!accessToken){
        navigate('/')
    }

    const [user, SetUser] = useState(null)
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(()=>{
        const fetchUser = async () => {
            try {
                const user = await getUser(accessToken);
                if (user) {
                    SetUser(user);
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.log(error);
                navigate('/');
            } finally {
                setLoadingUser(false);
            }
        };
        fetchUser();
    }, [accessToken])

    useEffect(()=>{

        const getAllBooks = async ()=>{
            try{
                const books = await fetchAllBooks(accessToken)
                if (books){
                    setBooks(books)
                    return
                }else{
                    showErrorToast('There was an error fetching books. Please reload the page again.')
                }
                
            }catch(error){
                console.log(error)
                showErrorToast('There was an error fetching books. Please reload the page again.')
            }
        }        

        getAllBooks()
    }, [accessToken])

    useEffect(()=>{
        const query = new URLSearchParams(location.search);
        const result = query.get('result');

        if (result === 'success') {
            console.log("payment successful!")
            showSuccessToast("Payment successful. Enjoy the book!")
        } else if (result === 'fail') {
            console.log("failed!")
            showErrorToast("Something went wrong. Please try again.")
        }
        
    }, [location])

    const logoutUser = ()=>{
        localStorage.removeItem("myfAccessToken")
        navigate("/")
    }


  return (
  <div className='user-profile-container'>
    <div className="user-container">
      {loadingUser ? (
        <div style={{ padding: "40px 0", textAlign: "center" }}>Loading...</div>
      ) : (
        <>
          <div className="user-data">
            <img src={UserIcon} alt="User" />
            <h3>{user && `${user.first_name} ${user.last_name}`}</h3>
          </div>
          <div className="actions-container">
            <button onClick={logoutUser}>
              <i className="fa-solid fa-right-from-bracket"></i>
              <p>Sign Out</p>
            </button>
          </div>
        </>
      )}
    </div>
    <div className="book-container">
      {books && books.map((book, idx) => (
        <Book key={book.id || book.book_id || idx} book={book} user={user} />
      ))}
    </div>
  </div>
);
}

export default UserProfile