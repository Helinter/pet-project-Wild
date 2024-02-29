function Home() {

  return (

    <section className="home">
      <p className="home-readme">Социальная сеть "Wild"<br />

FullStack проект Wild, в котором люди смогут обмениваться контентом, общаться в личных чатах и тредах под постами, искать фото, видео и другой контент, подписываться на обновления друг друга и так далее.<br />

Проект в разработке.<br />

Реализованный функционал:<br />

-регистрация и авторизация на React.<br /> -страница профиля: редактирование данных пользователя (имя, инфо, возраст, аватар, юзернейм, почта), добавление фотографий, кнопка логаута.<br /> -страница мессенджера: поиск пользователей по юзернейму, создание чатов, обмен сообщениями в реальном времени с помощью socket.io.<br /> -страница поиска: лента фотографий всех пользователей.<br /> -пользователи могут ставить лайки фотографиям друг-друга. пользователь может удалять свои фотографии.<br /> -просмотр фоторгафий через попап при клике по фотографии, селектор фотографий в попапе.<br />

Tехнологии: JavaScript, React.js, Node.js, Express.js, MongoDB, HTML5, CSS</p>
     
    </section>

  );
}

export default Home;
