import Photo from '../../images/1304332220_0_3b4cb_95648a16_orig.png';
import AddMedia from '../../images/icons/addMedia.svg';
import Micro from '../../images/icons/micro.svg';

function Messages() {

  return (

    <section className="messages">

      <div className="messages-list">
        <h2 className="messages-list__name">User Userovich</h2>
        <p className="messages-list__text">Сообщения</p>

        <div className="messages-list__list">

          <div className="messages-list__list-item">
            <img className="messages-list__list-item__photo" src={Photo} alt="photo" />
            <p className="messages-list__list-item__name">Gregory House</p>
            <div className="messages-list__list-item__indicator"></div>
          </div>

          <div className="messages-list__list-item">
            <img className="messages-list__list-item__photo" src={Photo} alt="photo" />
            <p className="messages-list__list-item__name">Gregory House</p>
            <div className="messages-list__list-item__indicator"></div>
          </div>

          <div className="messages-list__list-item">
            <img className="messages-list__list-item__photo" src={Photo} alt="photo" />
            <p className="messages-list__list-item__name">Gregory House</p>
            <div className="messages-list__list-item__indicator"></div>
          </div>

          <div className="messages-list__list-item">
            <img className="messages-list__list-item__photo" src={Photo} alt="photo" />
            <p className="messages-list__list-item__name">Gregory House</p>
            <div className="messages-list__list-item__indicator"></div>
          </div>

          <div className="messages-list__list-item">
            <img className="messages-list__list-item__photo" src={Photo} alt="photo" />
            <p className="messages-list__list-item__name">Gregory House</p>
            <div className="messages-list__list-item__indicator"></div>
          </div>

        </div>
      </div>

      <div className="messages-chat">
        <div className="messages-chat-header">
          <img className="messages-chat-header__photo" src={Photo} alt="photo" />
          <p className="messages-chat-header__name">Gregory House</p>
          <div className="messages-chat-header__indicator"></div>
        </div>
        <div className="messages-chat-chat">
          <p className="messages-chat-chat-message">Ну что там?</p>
          <p className="messages-chat-chat-message">с тюленями</p>
          <p className="messages-chat-chat-message">ты говорил будут тюлени</p>
          <p className="messages-chat-chat-message">АЛО</p>
          <p className="messages-chat-chat-message">ну понятно</p>
        </div>

        <div className="chat-input-container">
          <img src={AddMedia} alt="addMedia" className="chat-input-container-icon"/>
          <img src={Micro} alt="Micro" className="chat-input-container-icon"/>
          <input type="text" placeholder="Сообщение" className="chat-input-container__input"/>
        </div>
      </div>

    </section>

  );
}

export default Messages;
