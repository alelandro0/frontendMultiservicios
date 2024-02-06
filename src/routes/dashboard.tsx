import React, { useEffect, useState } from "react";
import PortalLayout from "../layout/PortalLayout";
import { useAuth } from "../Autenticacion/AutProvider";
import "./dashboard.css";

interface Publication {
  _id: string;
  // Otros campos de tu publicación
}

interface Image {
  url: string;
}

export default function Dashboard() {
  const auth = useAuth();

  const [userProfile, setUserProfile] = useState({
    profileImage: "",
  });

  const [editingProfileImage, setEditingProfileImage] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");

  useEffect(() => {
    // Esta función se ejecuta una vez al cargar el componente
    handleFileUpload();
  }, []); // El arreglo de dependencias vacío garantiza que el efecto se ejecute solo una vez

  async function handleProfileImageChange(files: FileList | null) {
    try {
      if (!files || files.length === 0) {
        console.error("No se seleccionó ningún archivo");
        return;
      }
  
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        setDownloadURL(data.url);
        setUserProfile((prevProfile) => ({
          ...prevProfile,
          profileImage: data.url,
        }));
        setEditingProfileImage(false);
        console.log("url de Post ", data);
        console.log("imagen actualizada con éxito");
        handleFileUpload()
      } else {
        console.error(
          "Error al cambiar la imagen de perfil:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error al cambiar la imagen de perfil:", error);
    }
  }

  async function handleFileUpload() {
    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json(); // Obtener la respuesta como texto
        console.log("Respuesta del servidor:", data);
  
        if (!downloadURL) {
          setDownloadURL(data); // Establecer la URL solo si no hay una ya establecida
          console.log("si hay url",downloadURL);
          
        }
  
        setUserProfile((prevProfile) => ({
          ...prevProfile,
          profileImage: data.url,
        }));
        console.log("URL de la imagen obtenida:", data);
        console.log("Imagen GET obtenida con éxito");
      } else {
        console.error(
          "Error al obtener la imagen de perfil:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error al obtener la imagen de perfil:", error);
    }
  }
  
  

  return (
    <PortalLayout>
      <div className="perfil">
      <div className="profile-header" onClick={() => setEditingProfileImage(true)}>
         
         <div>
           <input
             type="file"
             id="profileImageInput"
             style={{ display: "none" }}
             onChange={(e) => handleProfileImageChange(e.target.files)}
           />
           <label style={{ color: "white" }} htmlFor="profileImageInput">
             Seleccionar nueva imagen de perfil
           </label>
         </div>
       
           {downloadURL ? (
             <img
               src={downloadURL}
               alt="Perfil"
               className="profile-image"
             />
           ) : null}
     </div>
      </div>
    </PortalLayout>
  );
}
