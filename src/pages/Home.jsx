import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Nav from "../components/layout/Nav";
import FeedItem from "../components/FeedItem";
// import { initialFeedList } from "../data/response";

import { auth, db } from "../firebase";
import { collection, deleteDoc, doc, increment, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Home = ({ editedItem, onEdit }) => {
  // logic

  const user = auth.currentUser
  const history = useNavigate()
  let unsubscribe = null;



  

  const [feedList, setFeedList] = useState([]);

  //setFeedList(filterList)

  const handleEdit = (data) => {
    
    // 인자, argument
    onEdit(data); // 부모에게 수정할 객체 아이템 넘겨주기
    history("/edit"); // edit페이지로 이동
  };

  const handleDelete = async (selectedItem) => {
    if (selectedItem.useId !== user.uid) return;
    try {
      await deleteDoc(doc(db, 'chureads', selectedItem.id))
    } catch (error) {
      console.log(error)
    }



    if (selectedItem.useId !== user.uid) {
      console.log("🚀selectedItem:", selectedItem)
      console.log("user", user)

      return

    }
    // const filterList = feedList.filter((item) => item.id !== selectedItem.id);
    // setFeedList(filterList);



  };

  const handleLogout = async () => {
    const ok = window.confirm('리얼로 로그아웃 할거임?')
    if (!ok) return // 아니요 선택시 다음 줄 실행안함
    try {
      await auth.signOut()
      history('/login')
    } catch (error) {
      console.error(error)
    }

  };    //실시간으로 업뎃

  const getLiveData = () => {

    const collectionRef = collection(db, 'chureads')
    //query는 조건에 맞는 정보를 가져오는 역할
    const chureadQuery = query(collectionRef, orderBy('createAt', 'desc'))

    unsubscribe = onSnapshot(chureadQuery, (snapshot) => {
      const datas = snapshot.docs.map((item) => {

        return { id: item.id, ...item.data(), }
      })
      console.log("datas", datas)
      setFeedList(datas)
    })

  }


  const handleLike = async (selectedItem) => {

    console.log("좋아요")
    //파이어 베이스에게 likeCount의 값을 1씩 증가시키는 걸로

    await updateDoc(doc(db, 'chureads', selectedItem.id), { likeCount: increment(1) })



  }

  // 진입시 딱 한번 실행\



  useEffect(() => {
    getLiveData();

    return () => {
      unsubscribe && unsubscribe()
      console.log("🚀 ~ return ~ unsubscribe:", unsubscribe)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!editedItem) return;
    //editedItem의 값이 있는경우
    const resultFeedList = feedList.map((item) => {
      if (item.id === editedItem.id) return editedItem;
      return item;
    });
    setFeedList(resultFeedList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedItem]);





  // view
  return (
    <div className="h-full pt-20 pb-[74px] overflow-hidden">
      {/* START: 헤더 영역 */}
      <Header onLogout={handleLogout} />
      {/* END: 헤더 영역 */}
      <main className="h-full overflow-auto">
        <div>
          {/* START: 피드 영역 */}
          <ul>
            {feedList.map((feed) => (
              <FeedItem
                key={feed.id}
                data={feed}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onLike={handleLike}
              />
            ))}
          </ul>
          {/* END: 피드 영역 */}
        </div>
      </main>
      {/* START: 네비게이션 영역 */}
      <Nav />
      {/* END: 네비게이션 영역 */}
    </div>
  );

};
export default Home;
