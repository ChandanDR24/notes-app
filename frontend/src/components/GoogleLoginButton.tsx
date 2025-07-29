import { Button } from "@chakra-ui/react";

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = "https://notes-app-x9br.onrender.com/auth/google";
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      colorPalette="blue"
      color="white"
      _hover={{ bg: "blue.700" }}
      w="full"
    >
      Sign in with Google
    </Button>
  );
};

export default GoogleLoginButton;
