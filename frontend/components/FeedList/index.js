import styles from './FeedList.module.css';
import moment from 'moment';

const FeedList = ({getPersonalFeedList}) => {

    const getFormatDate = (date) =>{
      return moment(date).format("DD-MMM-YYYY");
    }

    return(<>
    <div className={styles['feed-list-wrapper']} >
              <div className={styles['feed-list-card']} >
                {
                  getPersonalFeedList && getPersonalFeedList.length > 0 
                  ? getPersonalFeedList.map((feedDetails,key) => (
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
                              <li>Published Date : <span>{getFormatDate(feedDetails.publishedAt)}</span></li>
                              <li>Source: {feedDetails.source_name}</li>
                              <li>Category: {feedDetails.category}</li>
                              <li>Author: {feedDetails.author}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                  :
                  <p style={{display: 'flex', justifyContent: 'center', alignContent:'center'}} >No Records available</p>
                }
              </div>
            </div>
    </>)
}

export default FeedList;