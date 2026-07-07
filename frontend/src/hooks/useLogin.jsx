import { useState } from 'react'

const useLogin = () => {
  const [errorRUT, setErrorRUT] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const errorData = (dataMessage) => {
        if(dataMessage.includes('RUT') || dataMessage.includes('rut')) {
            setErrorRUT(dataMessage);
        }
        else if(dataMessage.includes('Contraseña') || dataMessage.includes('contraseña')) {
            setErrorPassword(dataMessage);
        }
    };
  const handleInputChange = () => {
        setErrorRUT("");
        setErrorPassword("");
      };
    return {
        errorRUT, 
        errorPassword, 
        errorData, 
        handleInputChange
    };
}

export default useLogin;