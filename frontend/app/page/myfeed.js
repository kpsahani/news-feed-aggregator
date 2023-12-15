"use client";
import api from '@/Services/api';
import styles from './page.module.css';
import Navbar from '@/components/Navbar'
import { useEffect, useState } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { setTags, setPersonalizedTags, author, category, source, setPersonalFeed, personalFeedList } from '@/store/reducers/feedSlice';
import { useDispatch, useSelector } from 'react-redux';
import PersonalizeModal from '@/components/PersonalizeModal';

export default function Home() {
  const dispatch = useDispatch();
  const getAuthor = useSelector(author)
  const getCategory = useSelector(category)
  const getSource = useSelector(source)
  const getPersonalFeedList = useSelector(personalFeedList)

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePersonalizeSubmit = (selectedData) => {
    // Handle submitting selected data (authors, categories, sources)
    // console.log('Selected Data:', selectedData);
    // You can dispatch an action to store the selected data in your Redux store
    api.post('/select-preferences', selectedData).then(()=>{
      getPersonalTags()
      toast.success('Feed preferences updated!')
    })
  };

  const getPersonalTags = () =>{
    api.get('/personalized-tags').then((response)=>{
      if(response.data.data.length == 0){

      }
      else{
        getPersonalizedFeed()
        dispatch(setPersonalizedTags(response.data.data))
      }
    })
  }

  const getPersonalizedFeed = () =>{
    api.get('/personalized-feed').then((response) => {
      dispatch(setPersonalFeed(response.data.data.personalized_articles))
    })
  }
  
  useEffect(()=>{
    api.get('/getTags').then((response)=>{
      dispatch(setTags(response.data))
      getPersonalTags()
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch])

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
                  <li>Public Feeds</li>
                  <li>My Feeds</li>
                </ul>
              </div>
            </div>
            <div className={styles['feed-search-wrapper']} >
              <div className={styles['feed-search-bar']} >
                <input type='search' placeholder='serach here...' className={styles.searchInput} />
              </div>
            </div>
            <div className={styles['feed-options-wrapper']} >
              <div className={styles['feed-filters']} >
                <ul>
                  <li>
                    <label>Date</label>
                    <select>
                      <option>Newest</option>
                      <option>Oldest</option>
                    </select>
                  </li>
                  <li>
                    <label>Source</label>
                    <select>
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
                    <select>
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
                    <select>
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
              <div className={styles['feed-personalized-setting']} >
                <button onClick={() => setIsModalOpen(true)} className={styles['personalized-btn']}>
                  <svg width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 pointer-events-none icon"><path d="M16.5 12a3 3 0 013 3v1.5a3 3 0 01-3 3H15a3 3 0 01-3-3H5.25a.75.75 0 110-1.5H12a3 3 0 013-3h1.5zm0 1.5H15a1.5 1.5 0 00-1.493 1.356L13.5 15v1.5a1.5 1.5 0 001.356 1.493L15 18h1.5a1.5 1.5 0 001.493-1.356L18 16.5V15a1.5 1.5 0 00-1.356-1.493L16.5 13.5zM9 4.5a3 3 0 013 3h6.75a.75.75 0 110 1.5H12a3 3 0 01-3 3H7.5a3 3 0 01-3-3V7.5a3 3 0 013-3H9zM7.5 6a1.5 1.5 0 00-1.493 1.356L6 7.5V9a1.5 1.5 0 001.356 1.493l.144.007H9a1.5 1.5 0 001.493-1.356L10.5 9V7.5a1.5 1.5 0 00-1.356-1.493L9 6H7.5z" fill="currentcolor" fillRule="evenodd"></path></svg>
                  <span>Feed settings</span>
                </button>
              </div>
            </div>
            
            <div className={styles['feed-list-wrapper']} >
              <div className={styles['feed-list-card']} >
                {
                  getPersonalFeedList && getPersonalFeedList.map((feedDetails,key) => (
                    <div key={key} className={styles['feed-list-item']} >
                      <div className={styles['feed-list-Box']} >
                        <div className={styles['card-left']} >
                          <img width={100} height={100} src='https://res.cloudinary.com/daily-now/image/upload/f_auto/v1/placeholders/7' alt="img" />
                        </div>
                        <div className={styles['card-right']} >
                          <h3>{feedDetails.title}</h3>
                          <p>{feedDetails.description}</p>
                          <div className={styles['news-utils']} >
                            <ul>
                              <li>Published Date : <span>{feedDetails.publishedAt}</span></li>
                              <li>Source: {feedDetails.source_name}</li>
                              <li>Category: {feedDetails.category}</li>
                              <li>Author: {feedDetails.author}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </main>
      {isModalOpen && (
        <PersonalizeModal onClose={() => setIsModalOpen(false)} onSubmit={handlePersonalizeSubmit} />
      )}
    </>
  )
}
