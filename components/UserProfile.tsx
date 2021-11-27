interface userInterface {
  user: any;
}
const UserProfile: React.FC<userInterface> = (props) => {
  return (
    <div className="box-center">
      <img src={props.user.photoURL} alt="" className="card-img-center" />
      <p>
        <i>@{props.user.username}</i>
      </p>
      <h1>{props.user.displayName}</h1>
    </div>
  );
};

export default UserProfile;
