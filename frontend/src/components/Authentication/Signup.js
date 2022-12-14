import { Button} from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input,  InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import React, {useState} from "react";
import {useToast} from "@chakra-ui/react";
import axios from "axios";
import {useHistory} from 'react-router-dom'

const Signup=()=>{
  const [show,setShow]=useState(false);
  const [name,setName]=useState();
  const [email,setEmail]=useState();
  const [password,setPassword] = useState();
  const [confirmpassword,setConfirmpassword]=useState();
  const [pic,setPic]=useState();
  const [loading, setLoading]=useState(false)
  const toast=useToast();
  const history=useHistory();

  const handleClick=()=>setShow(!show);

  const postDetails=(pics)=>{
    setLoading(true);
    if(pics===undefined){
      toast({
        title: 'Por favor ingrese una foto',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:"bottom",
      });
      return;
    }

    if(pics.type==="image/jpeg" || pics.type==="image/png"){
      const data = new FormData();
      data.append("file",pics);
      data.append("upload_preset","chat-app");
      data.append("cloud_name","didebnh0m");
      fetch("https://api.cloudinary.com/v1_1/didebnh0m/image/upload",{
        method:'post', 
        body: data,
      })
      .then((res)=>res.json())
        .then(data=>{
        setPic(data.url.toString());
        console.log(data.url.toString());
        setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }else{
      toast({
        title: "Por favor ponga una foto!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler=async()=>{
    setLoading(true);
    if (!name || !email || !password || !confirmpassword ) {
      toast({
        title: "Por favor llene todos los campos",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Las contrase??as no coinciden",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try{
      const config={
        headers:{
          "Content-type": "application/json",
        },
      };

      const {data}=await axios.post(
        "http://localhost:5000/api/user/",
        {name,email,password,pic},
        config
        );
        toast({
          title: "Registro existoso",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });

        localStorage.setItem('userInfo',JSON.stringify(data));

        setLoading(false);
        history.push("/chats")
      } catch(error){
        toast({
          title: "Ocurrio un error!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
    }
  };

  return(
  <VStack spacing='5px' color="black">
    <FormControl id="first-name" isRequired>
      <FormLabel>Nombre</FormLabel>
      <Input
        placeholder="Ingrese su Nombre"
        onChange={(e)=>setName(e.target.value)}
      />
    </FormControl>
    <FormControl id="email" isRequired>
      <FormLabel>Correo</FormLabel>
      <Input
        placeholder="Ingrese su Correo"
        onChange={(e)=>setEmail(e.target.value)}
      />
    </FormControl>

    <FormControl id="password" isRequired>
      <FormLabel>Contrase??a</FormLabel>
      <InputGroup>
      <Input
        type={show? "text":"password"}
        placeholder="Ingrese su Contrase??a"
        onChange={(e)=>setPassword(e.target.value)}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? "Hide":"Show"}
        </Button>
      </InputRightElement>
      </InputGroup>     
    </FormControl>

    <FormControl id="password" isRequired>
      <FormLabel>Confirme la contrase??a</FormLabel>
      <InputGroup>
      <Input
        type={show? "text":"password"}
        placeholder="Confirme la contrase??a"
        onChange={(e)=>setConfirmpassword(e.target.value)}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? "Hide":"Show"}
        </Button>
      </InputRightElement>
      </InputGroup>     
    </FormControl>

    <FormControl id="pic">
      <FormLabel>Suba una imagen</FormLabel>
      <Input
        type="file"
        p={1.5}
        accept="image/*"
        onChange={(e)=> postDetails(e.target.files[0])}
      />
    </FormControl>

    <Button
      colorScheme="blue"
      width="100%"
      color="white"
      style={{marginTop:15}}
      onClick={submitHandler}
      isLoading={loading}
    >
      Registrarse
    </Button>
  </VStack>
  );
};

export default Signup;