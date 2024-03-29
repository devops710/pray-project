import axios from 'axios';
import {useContext, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useInView} from 'react-intersection-observer';
import {AppContext} from '../../App';

const TourList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const long = location.state.tourLong;
  const lat = location.state.tourLat;
  const [data, setData] = useState([]);
  const [pageCnt, setPageCnt] = useState(1);
  const [totalCnt, setTotalCnt] = useState(1);
  const [ref, inView] = useInView();
  const searchKey = 'locationBasedList1';
  const serviceKey =
    '1s%2F8YBFyhR5rW1nadGx2niB4GW7BohRLFNbFjtF8S4%2FtnV0tAeCBed6AYO%2Fjq0fyi7Ceq933829psbDswpP5Jw%3D%3D';
  const coordinate = useContext(AppContext);
  coordinate.chargingStation.lng = Number(
    Number(location.state.tourLong).toFixed(6),
  );
  coordinate.chargingStation.lat = Number(
    Number(location.state.tourLat).toFixed(6),
  );

  const getData = async () => {
    if (totalCnt >= pageCnt) {
      try {
        await axios
          .get(
            // eslint-disable-next-line no-template-curly-in-string
            `http://apis.data.go.kr/B551011/KorService1/${searchKey}?serviceKey=${serviceKey}&_type=json&numOfRows=10&pageNo=${pageCnt}&MobileOS=ETC&MobileApp=AppTest&arrange=E&mapX=${long}&mapY=${lat}&radius=2000&listYN=Y&contentTypeId=12`,
          )
          .then(response => {
            setTotalCnt(Math.ceil(response.data.response.body.totalCount / 10));
            const mergeData = data.concat(
              response.data.response.body.items.item,
            );
            setData(mergeData);
            setPageCnt(pageCnt + 1);
          });
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    if (inView) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const onClick = item => {
    navigate('/info', {
      state: {
        contentId: item.contentid,
        mapLong: Number(item.mapx).toFixed(6),
        mapLat: Number(item.mapy).toFixed(6),
      },
    });
  };

  console.log(data);

  return (
    <div>
      <h1>Tour</h1>
      {data &&
        data.map(item => (
          <ul
            className={'tour'}
            key={item.contentid}
            onClick={() => onClick(item)}>
            <li>{item.title}</li>
            <li>{item.addr1}</li>
            <li>{item.dist.split('.')[0]}m</li>
          </ul>
        ))}
      <div ref={ref} style={{height: '20px'}}></div>
    </div>
  );
};

export default TourList;
