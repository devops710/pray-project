import { useState, useEffect, memo } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import {useInView} from 'react-intersection-observer';

const SearchResult = ({addr , isClicked, resultList, moreHandler}) => {

    const [responseData, setResponseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEmpty, setIsEmpty] = useState(false);
    const [pageCnt, setPageCnt] = useState(1);
    const [totalCnt, setTotalCnt] = useState(1);
    const [ref, inView] = useInView(false);

    //const [mainLong, setMainLong] = useState(null);
    //const [mainLat, setMainLat] = useState(null);
    const navigate = useNavigate();    
    const serviceKey = process.env.REACT_APP_API_KEY;

    const search = async () => {
        if ( totalCnt >= pageCnt) {
            try {
                // let num = page.current + 1;
                setError(null);
                //setData(null);
                setLoading(true);
               
                
                console.log(pageCnt);     
        
                const response = await axios.get(
                `/service/EvInfoServiceV2/getEvSearchList?serviceKey=${serviceKey}&pageNo=${pageCnt}&numOfRows=10&addr=${addr}`
                );
                // setPage((prevPage) => ({
                //     ...prevPage,
                //     current : num,
                //     total: response.data.response.body.totalCount,            
                // }));
                // console.log(page.total);
                console.log(response.data.response.body.totalCount);
                if(response.data.response.body.totalCount !== 0){
                    setTotalCnt(Math.ceil(response.data.response.body.totalCount / 10));
                    const newData = responseData.concat(response.data.response.body.items.item);
                    console.log(newData);
                    setResponseData(newData);
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
                console.log(response.data.response.body.items);
                console.log(responseData);
                // if(response.data.response.body.items === ''){
                // } 
                // console.log(scrollRef.current);      
                // window.scrollTo(0, scrollRef.current);     
                
            } catch(e) {
                setError(e);
            }
            setLoading(false);
        }
    };

    const onClick = e => {
        const long = e.currentTarget.getAttribute('data-long');
        const lat = e.currentTarget.getAttribute('data-lat');
        //setMainLong(long);
        //setMainLat(lat);
        console.log(long, lat);
        const csNm = e.currentTarget.getAttribute('data-csnm');
        const addr = e.currentTarget.getAttribute('data-addr');
        const cpNm = e.currentTarget.getAttribute('data-cpnm');
        const cpStat = e.currentTarget.getAttribute('data-cpstat');
        const cpTp = e.currentTarget.getAttribute('data-cptp');
        const chargeTp = e.currentTarget.getAttribute('data-chargetp');
        //console.log(mainLong, mainLat);
        navigate('/map', {
            state: {
              mapLong: long,
              mapLat: lat,
              csNm: csNm,
              addr: addr,
              cpNm: cpNm,
              cpStat: cpStat,
              cpTp: cpTp,
              chargeTp: chargeTp,
            },
          });
    };

    // const showMore = () => {
    //     const num = page.current + 1;
    //     setPage((prevPage) => ({
    //       ...prevPage,
    //       current: num,
    //     }));
    //     search(num);
    //   };
    
    // const handleScroll = () => {
    //     if (
    //         window.innerHeight + document.documentElement.scrollTop ===
    //         document.documentElement.offsetHeight
    //     ) {
    //         showMore();
    //     }
    // };

    // useEffect(() => {
    //     window.addEventListener('scroll', handleScroll);
    //     return () => {
    //       window.removeEventListener('scroll', handleScroll);
    //     };
    // }, []);
    // useEffect(() => {
    //     if (inView) {
    //         search();
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //   }, [inView]);


    // useEffect(() => {
    //     if(!inView){
    //         setPageCnt(1);
    //         setResponseData([]);
    //         setIsEmpty(false);
    //         setTotalCnt(1);
    //     }
    //     if (addr !== "" && inView) {            
    //         moreHandler();
    //       }
    //     //   console.log(scrollRef.current);      
    //     //   window.scrollTo(0, scrollRef.current);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps        
    // }, [addr, isClicked, inView]);

    useEffect(() => {
        if(inView && moreHandler) {
            moreHandler();
        }
    }, [inView]);

    // const showMore = () => {  
    //     scrollRef.current = window.scrollY;
    //     console.log(scrollRef.current);
                
    //     search();
    // }
   
    if(loading) return <div>Loading...</div>;
    if(error)   return <div>Error...</div>;
    if(isEmpty) return <div><h3>검색결과가 없습니다.</h3></div>

    return(
        <div>
            {!isEmpty && resultList && Array.isArray(resultList) ? (resultList.map((item) => (
                <ul
                className={'tour'}
                key={item.cpid}
                data-long={item.longi} 
                data-lat={item.lat}
                data-csnm={item.csNm}
                data-addr={item.addr}
                data-cpnm={item.cpNm}
                data-cpstat={item.cpStat}
                data-cptp={item.cpTp}
                data-chargetp={item.chargeTp}
                onClick={onClick}
                >
                    <li>{item.csNm}</li>
                    <li>{item.addr}</li>
                    <li>
                        {item.cpNm} :  
                        {item.cpStat === 1 ? " 충전가능" : item.cpStat === 2 ? " 충전중" : item.cpStat === 3 ? " 고장/점검" : item.cpStat === 4 ? " 통신장애" : " 통신미연결"}
                    </li>
                    <li>
                        {item.cpTp === 1 ? "B타입(5핀)" : item.cpTp === 2 ? "C타입(5핀)" : item.cpTp === 3 ?  "BC타입(5핀)" : item.cpTp === 4 ? "BC타입(7핀)" : item.cpTp === 5 ? 
                        "DC차데모" : item.cpTp === 6 ? "AC3상" : item.cpTp === 7 ? "DC콤보" : item.cpTp === 8 ? "DC차데모+DC콤보" : item.cpTp === 9 ? "DC차데모+AC3상" : "DC차데모+DC콤보+AC3상"}
                    </li>
                </ul>
            ))) : ( !isEmpty && responseData && (
                <ul
                className={'tour'}
                key={responseData.cpid}
                data-long={responseData.longi} 
                data-lat={responseData.lat}
                data-csnm={responseData.csNm}
                data-addr={responseData.addr}
                data-cpnm={responseData.cpNm}
                data-cpstat={responseData.cpStat}
                data-cptp={responseData.cpTp}
                data-chargetp={responseData.chargeTp}
                onClick={onClick}
                >
                    <li>{responseData.csNm}</li>
                    <li>{responseData.addr}</li>
                    <li>
                        {responseData.cpNm} :  
                        {responseData.cpStat === 1 ? " 충전가능" : responseData.cpStat === 2 ? " 충전중" : responseData.cpStat === 3 ? " 고장/점검" : responseData.cpStat === 4 ? " 통신장애" : " 통신미연결"}
                    </li>
                    <li>
                        {responseData.cpTp === 1 ? "B타입(5핀)" : responseData.cpTp === 2 ? "C타입(5핀)" : responseData.cpTp === 3 ?  "BC타입(5핀)" : responseData.cpTp === 4 ? "BC타입(7핀)" : responseData.cpTp === 5 ? 
                        "DC차데모" : responseData.cpTp === 6 ? "AC3상" : responseData.cpTp === 7 ? "DC콤보" : responseData.cpTp === 8 ? "DC차데모+DC콤보" : responseData.cpTp === 9 ? "DC차데모+AC3상" : "DC차데모+DC콤보+AC3상"}
                    </li>
                </ul>
            ))}
            {!isEmpty && responseData && <div ref={ref} style={{height: '20px'}}></div>}
        </div>
    );
};


export default memo(SearchResult);