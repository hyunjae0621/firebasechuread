import React, { useState } from "react";
import { RiHeartLine, RiPencilFill } from "react-icons/ri";
import { FaTrash } from "react-icons/fa6";
import { auth, db } from "../firebase";


const FeedItem = ({ data, onEdit, onDelete, onLike }) => {
  // logic
  const { userName, userProfileImage, churead, likeCount } = data;
  const user = auth.currentUser




  const handleDelete = () => {
    // confirm: 사용자에게 확인 | 취소 할수 있도록 선택하게 하는 알림창으로 boolean타입을 리턴함
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (ok) {
      // 사용자가 확인을 선택한 경우
      onDelete(data); // 부모에게 데이터를 넘겨주기 위함
    }
  };


  const isSame = (user.uid === data.useId)
  console.log("🚀 ~ FeedItem ~ isSame:", isSame)


  
  // view
  return (
    <li className="border-t border-churead-gray-300 border-opacity-15 px-6 py-3">
      <div className="flex items-start gap-3">
        {/* START: 프로필 이미지 영역 */}
        <div className="w-10 rounded-full overflow-hidden mt-1">
          <img src={userProfileImage} alt="사용자 프로필 이미지" />
        </div>
        {/* END: 프로필 이미지 영역 */}
        {/* START: 콘텐츠 영역 */}
        <div className="w-full">
          <div className="flex items-center">
            <span className="font-bold">{userName}</span>
            
            
            
            {/* START: 수정, 삭제 버튼 영역 
            currentUser.uid = useId 인 FeedItem 에 대해서는 div 가 보이고
            currentUser.uid !== useId 인 FeedItem 에 대해서는 div 가 보이지 않는다.
            */}


            {isSame && (<div className="ml-auto flex gap-1">
              <button type="button" className="max-w-6 p-1" onClick={() => onEdit(data)}>
                <RiPencilFill size={"18px"} /> </button>
              <button type="button" className="max-w-6 p-1" onClick={handleDelete}>
                <FaTrash size={"14px"} /> </button>
            </div>)}

            {/* END: 수정, 삭제 버튼 영역 */}





          </div>
          <p className="pt-1">{churead}</p>
          {/* START: 좋아요 영역 */}
          <div className="flex items-center gap-1">
            <button type="button" className="text-churead-gray-400">
              <RiHeartLine onClick={() => onLike(data)}/>
              {/* <RiHeartFill color="red" /> */}
            </button>
            <span>{likeCount}</span>
          </div>
          {/* END: 좋아요 영역 */}
        </div>
        {/* END: 콘텐츠 영역 */}
      </div>
    </li>
  );
};

export default FeedItem;
