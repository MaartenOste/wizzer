import { default as React, useState } from 'react';

const Button = ({text, type, onClick= () => {}, extraClasses}) => {
  const [showPopup, setShowPopup] = useState(false);

  const handlePopup = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  }

  return (
    <div className={`button--container ${extraClasses}`}>
      {type === 'invite' && showPopup &&
      <div className="button--popup">
        <span>Uitnodiging gekopieerd!</span>
      </div>
      }
      <button className={`button--${type}`} onClick={()=> {handlePopup(); onClick()}}>
        {text}
      </button>
    </div>
  );
};

export default Button;