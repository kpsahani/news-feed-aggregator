"use client";
import api from '@/Services/api';
import styles from './page.module.css';
import Navbar from '@/components/Navbar'
import { useEffect, useState } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { setTags, setPersonalizedTags, author, category, source, setPersonalFeed, personalFeedList, getPersonalizedTags } from '@/store/reducers/feedSlice';
import { useDispatch, useSelector } from 'react-redux';
import PersonalizeModal from '@/components/PersonalizeModal';
import { selectIsAuthenticated } from '@/store/reducers/authSlice';
import FeedList from '@/components/FeedList';

export default function Home() {
  const dispatch = useDispatch();
  const getAuthor = useSelector(author)
  const getCategory = useSelector(category)
  const getSource = useSelector(source)
  const getPersonalFeedList = useSelector(personalFeedList)
  const isAuth = useSelector(selectIsAuthenticated)
  const selectedPersonalizedTags = useSelector(getPersonalizedTags)


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('')
  const [categoryName, setCategory] = useState('')
  const [sourceName, setSource] = useState('')
  const [authorName, setAuthor] = useState('')
  const [order, setOrder] = useState('desc')
  const [feedType, setFeedType] = useState('PUBLIC');

  const handlePersonalizeSubmit = (selectedData) => {
    api.post('/select-preferences', selectedData).then(()=>{
      getPersonalTags()
      toast.success('Feed preferences updated!')
    })
  };

  const getPersonalTags = () =>{

    if(isAuth && feedType == 'MY_FEED'){
      api.get('/personalized-tags').then((response)=>{
        console.log("response", response);
        if(response.data.data.length == 0){
          setIsModalOpen(true)
        }
        else{
          getPersonalizedFeed()
          dispatch(setPersonalizedTags(response.data.data))
        }
      })
    }
    else{
      // getPublicFeed()
    }

  }

  const getPublicFeed = () => {
    const sort = 'publishedAt'; // Default sort by publishedAt
  
    // Make the API request with the defined parameters
    api.get('/public-feed', {
      params: {
        search,
        category: categoryName,
        source: sourceName,
        author: authorName,
        sort,
        order,
        page: 1, // Add other pagination parameters as needed
        per_page: 500,
      },
    }).then((response) => {
      dispatch(setPersonalFeed(response.data.data.public_feed.data));
    }).catch((error) => {
      console.error("Error fetching public feed:", error);
    });
  };

  const getPersonalizedFeed = () =>{
    const params = {
      page: 1, 
      per_page: 500, 
      search: search || '',
      category: categoryName || '', 
      source: sourceName || '',
      author: authorName || '',
      order: order , 
    };
  
    api.get('/personalized-feed', { params }).then((response) => {
      dispatch(setPersonalFeed(response.data.data.personalized_articles.data))
    });
  }

  useEffect(()=>{
    console.log("feedType == 'MY_FEED' && selectedPersonalizedTags.length > 0", feedType == 'MY_FEED' && selectedPersonalizedTags.length > 0);
    if(feedType == 'PUBLIC'){
      getPublicFeed()
    }
    else if(feedType == 'MY_FEED' && selectedPersonalizedTags.length > 0){
      getPersonalizedFeed()
    }
  },
  [
    search,
    categoryName,
    sourceName,
    authorName,
    order,
    feedType,
    selectedPersonalizedTags
  ])
  
  useEffect(()=>{
    
    api.get('/getTags').then((response)=>{
      dispatch(setTags(response.data))
      if(feedType == 'MY_FEED' && isAuth){
        getPersonalTags()
      }
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch,isAuth,feedType])

  return (
    <>
      <Navbar />
      <Toaster position="top-center" />
      <main className={styles.main}>
        <div className='container' >
          <div className={styles['feed-board']} >
            <div className={styles['feed-tab-wrapper']} >
              <div className={styles['feed-tab']} >
                <ul>
                  {
                    isAuth
                    &&
                    <>
                      <li className={feedType == 'PUBLIC' ? 'Active' : ''} onClick={() => setFeedType('PUBLIC')} >Public Feeds</li>
                      <li className={feedType == 'MY_FEED' ? 'Active' : ''} onClick={() => setFeedType('MY_FEED')} >My Feeds</li>
                    </>
                  }
                </ul>
              </div>
            </div>
            <div className={styles['feed-search-wrapper']} >
              <div className={styles['feed-search-bar']} >
                <input type='search' value={search} placeholder='serach here...' className={styles.searchInput} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div className={styles['feed-options-wrapper']} >
              <div className={styles['feed-filters']} >
                <ul>
                  <li>
                    <label>Date</label>
                    <select onChange={(e) => setOrder(e.target.value)} >
                      <option value={'desc'} >Newest</option>
                      <option value={'asc'} >Oldest</option>
                    </select>
                  </li>
                  <li>
                    <label>Source</label>
                    <select  onChange={(e) => setSource(e.target.value)} >
                    <option value='' >Select Source</option>
                    {
                        getSource && getSource.map((name, key)=>(
                          <option key={key} value={name} >{name}</option>
                        ))
                      }
                    </select>
                  </li>
                  <li>
                    <label>Author</label>
                    <select  onChange={(e) => setAuthor(e.target.value)}>
                      <option value='' >Select Author</option>
                      {
                        getAuthor && getAuthor.map((name, key)=>(
                          <option key={key} value={name} >{name}</option>
                        ))
                      }
                    </select>
                  </li>
                  <li>
                    <label>Category</label>
                    <select onChange={(e) => setCategory(e.target.value)}>
                    <option value='' >Select Category</option>
                    {
                        getCategory && getCategory.map((name, key)=>(
                          <option key={key} value={name} >{name}</option>
                        ))
                      }
                    </select>
                  </li>
                </ul>
              </div>
              {
                feedType == 'MY_FEED' && isAuth
                &&
                <div className={styles['feed-personalized-setting']} >
                  <button onClick={() => setIsModalOpen(true)} className={styles['personalized-btn']}>
                    <svg width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 pointer-events-none icon"><path d="M16.5 12a3 3 0 013 3v1.5a3 3 0 01-3 3H15a3 3 0 01-3-3H5.25a.75.75 0 110-1.5H12a3 3 0 013-3h1.5zm0 1.5H15a1.5 1.5 0 00-1.493 1.356L13.5 15v1.5a1.5 1.5 0 001.356 1.493L15 18h1.5a1.5 1.5 0 001.493-1.356L18 16.5V15a1.5 1.5 0 00-1.356-1.493L16.5 13.5zM9 4.5a3 3 0 013 3h6.75a.75.75 0 110 1.5H12a3 3 0 01-3 3H7.5a3 3 0 01-3-3V7.5a3 3 0 013-3H9zM7.5 6a1.5 1.5 0 00-1.493 1.356L6 7.5V9a1.5 1.5 0 001.356 1.493l.144.007H9a1.5 1.5 0 001.493-1.356L10.5 9V7.5a1.5 1.5 0 00-1.356-1.493L9 6H7.5z" fill="currentcolor" fillRule="evenodd"></path></svg>
                    <span>Feed settings</span>
                  </button>
                </div>
              }

            </div>
            
            <FeedList getPersonalFeedList={getPersonalFeedList} />
          </div>
        </div>
      </main>
      {isModalOpen && (
        <PersonalizeModal onClose={() => setIsModalOpen(false)} onSubmit={handlePersonalizeSubmit} />
      )}
    </>
  )
}
