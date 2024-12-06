import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../../../../source/axiosInstance';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../../../../Context/FavoritesContext';
import { toast } from 'sonner';
import './BoxAdmin.css';

export default function BoxAdmin() {
  const [admins, setAdmins] = useState([]);
  const cardRef = useRef(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedAdmins, setSelectedAdmins] = useState(new Set());


  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axiosInstance.get('/api/user/list-users');
        const adminUsers = response.data.filter(user => user.role === 'Admin');
        setAdmins(adminUsers);
      } catch (error) {
        console.error('Erro ao buscar os Administradores:', error);
      }
    };
  
    fetchAdmins();
  }, []);

  const handleSelectAdmin = (adminId) => {
    setSelectedAdmins((prevSelected) => {
      const updatedSelected = new Set(prevSelected);
      if (updatedSelected.has(adminId)) {
        updatedSelected.delete(adminId);
      } else {
        updatedSelected.add(adminId);
      }
      return updatedSelected;
    });
  };
  

  const handleSelectAll = () => {
    if (selectedAdmins.size === admins.length) {
      setSelectedAdmins(new Set());
    } else {
      setSelectedAdmins(new Set(admins.map(candidate => candidate._id)));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const idsToDelete = Array.from(selectedAdmins);

      // Itera sobre cada ID e envia uma requisição DELETE
      for (const id of idsToDelete) {
        await axiosInstance.delete(`/api/user/delete-user/${id}`);
        toast.success("Deletado com Sucesso!")
      }

      // Atualiza o estado para remover as admins deletados da lista
      setAdmins(prevadmins => prevadmins.filter(admin => !selectedAdmins.has(admin._id)));
      setSelectedAdmins(new Set());

    } catch (error) {
      console.error('Erro ao deletar os admnistradores selecionadas:', error);
    }

  };


  function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }


  return (
    <>

      <div className='actions'>
        <button
          className={`action-selecionar ${selectedAdmins.size === admins.length ? 'selecionado' : ''}`}
          onClick={handleSelectAll}
        >
          {selectedAdmins.size === admins.length ? 'Desselecionar tudo' : 'Selecionar tudo'}
        </button>
        <button className='action-deletar' onClick={handleDeleteSelected} disabled={selectedAdmins.size === 0}>
          Deletar selecionados
        </button>
      </div>
      <section className='container-vagas'>

        {admins && admins.length === 0 ? (
          <p>Nenhum admnistrador encontrado no momento.</p>
        ) : (
          admins && admins.map((admin) => (
            <div className='content-curriculos-recomendados' key={admin._id || admin.email}>
              <div className='content-area-curriculos'>
                <h1>ver mais</h1>
              </div>
              <div className='content-infos-curriculos-select'>

                <div className='content-infos-curriculos' onClick={() => setSelectedAdmin(admin)}>

                  <div className='content-infos-curriculos-nome'>
                    <h1>{admin.email}</h1>
                  </div>
                  <h3 className='area-atuacao'>{admin._id}</h3>
                  {/* <h3>{admin.candidateTargetSalary}</h3>
                  <p>{admin.candidateAbout}</p> */}
                </div>

                <div className='select-candidate-checkbox'>
                  <input
                    type="checkbox"
                    checked={selectedAdmins.has(admin._id)}
                    onChange={(e) => { e.stopPropagation(); handleSelectAdmin(admin._id) }}

                  />
                </div>
              </div>

            </div>
          ))
        )}
      </section>
    </>
  );
}