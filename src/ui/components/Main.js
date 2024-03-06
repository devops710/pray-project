import SearchResult from './SearchResult';
import {useState, memo, useEffect} from 'react';
import axios from "axios";

const Main = () => {
  const [addr, setAddr] = useState('');
  const [isClicked, setIsClicked] = useState(false);

  const [responseData, setResponseData] = useState([]);
  const [pageCnt, setPageCnt] = useState(1);
  const [totalCnt, setTotalCnt] = useState(1);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = e => {
    setAddr(e.target.value);
    setIsClicked(false);
  };

  const onKeyDown = e => {
    if(e.key === "Enter"){
      onClick();
    }
  };
  
  const onClick = () => {    
    console.log(addr);
    // setIsClicked(true);
    search();
  };

  const onMoreHandler = () => {
    console.log("onMoreHandler")
    if(totalCnt >= pageCnt && addr != null && addr.length > 0) {
      search();
    }
  };

  useEffect(() =>  {
    console.log("loaing:", loading);
  }, [loading])

  const search = async () => {
    if(loading) {
      return;
    }
    // if ( totalCnt >= pageCnt) {
        try {
            // let num = page.current + 1;
            setError(null);
            //setData(null);
            setLoading(true);
           
            console.log("addr:", addr);
            console.log(pageCnt);     
    
            const {status, data} = await axios.get(
            `/service/EvInfoServiceV2/getEvSearchList?serviceKey=${process.env.REACT_APP_API_KEY}&pageNo=${pageCnt}&numOfRows=10&addr=${addr}`
            );
            // setPage((prevPage) => ({
            //     ...prevPage,
            //     current : num,
            //     total: response.data.response.body.totalCount,            
            // }));
            // console.log(page.total);
            console.log('response:', status);
            console.log("data:", data);

            
            
            if(status === 200 && data.response.body != undefined && data.response.body.totalCount !== 0){
                setTotalCnt(Math.ceil(data.response.body.totalCount / 10));
                const newData = responseData.concat(data.response.body.items.item);
                console.log(newData);
                if(Array.isArray(newData)) {
                  setResponseData(newData);
                } else{
                  setResponseData([...newData])
                }
                // setResponseData(newData);
                setPageCnt(pageCnt + 1);
            } else {
                setResponseData([]);
                setIsEmpty(true);
                setResponseData([]);
                setPageCnt(1);
                setTotalCnt(1);

            }
            // setResponseData((prevData) => (
            //     newData`
            //       ? Array.isArray(newData)
            //         ? [...(prevData || []), ...newData]
            //         : [...(prevData || []), newData]
            //       : prevData || []
            //   ));
            // console.log(response.data.response.body.items);
            // console.log(responseData);
            // if(response.data.response.body.items === ''){
            // } 
            // console.log(scrollRef.current);      
            // window.scrollTo(0, scrollRef.current);     
            
        } catch(e) {
            console.log('error:', e);
            setError(e);
        }
        setLoading(false);
    // }
};

  return (
    <>
      <h1>Main</h1>
      <br />
      <input
        placeholder="지역명/충전소명 입력"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={addr}
        autoFocus
      />
      <button onClick={onClick}>검색</button>
      <SearchResult addr = {addr} isClicked = {isClicked} resultList={responseData} moreHandler={onMoreHandler}/>
      {loading && <div>loading...</div>}
    </>
  );
};

export default Main;