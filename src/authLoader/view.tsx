import Logo from "../styles/images/logo.png";

const AuthLoader = () => {
  return (
    <div className="full-page-loader">
      <img width="200" alt="logo" src={Logo} />
    </div>
  );
};
export default AuthLoader;
