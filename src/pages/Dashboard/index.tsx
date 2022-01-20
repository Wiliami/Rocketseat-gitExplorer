import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';

//import Logo from '../../assets/'';
import { Title, Form, Repositories, Error } from './styles';
import { useEffect } from 'react';


interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');

  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem(
      '@GithubExplorer:repositories',
    );

    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    }
    return [];
  });

  // usando o state para quando os valores forem dinâmicos, ou seja, quando os valores forem consumir dados da minha API



  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:repositories',
      JSON.stringify(repositories)
    );
  }, [repositories]);

  async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite o autor e nome do repositório');
      return;
    }


    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');
    } catch (err) {
      setInputError('Erro na busca por esse repositório');
    }
  }

  return (
    <>
      <img src={Logo} alt="Github explorer" />
      <Title> Explore repositórios do github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>

        <input
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}

          placeholder="Digite aqui o nome do repositório" />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories >
        {repositories.map(repository =>

          <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
            <img src={repository.owner.avatar_url} alt={repository.owner.login} />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>

        )}


      </Repositories>

      <div className="container-fluid pb-0 mb-0 justify-content-center text-light ">
        <footer>
          <div className="row my-5 justify-content-center py-5">
            <div className="col-11">
              <div className="row ">
                <div className="col-xl-8 col-md-4 col-sm-4 col-12 my-auto mx-auto a">
                  <h3 className="text-muted mb-md-0 mb-5 bold-text">Pepper.</h3>
                </div>
                <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                  <h6 className="mb-3 mb-lg-4 bold-text "><b>MENU</b></h6>
                  <ul className="list-unstyled">
                    <li>Home</li>
                    <li>About</li>
                    <li>Blog</li>
                    <li>Portfolio</li>
                  </ul>
                </div>
                <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                  <h6 className="mb-3 mb-lg-4 text-muted bold-text mt-sm-0 mt-5"><b>ADDRESS</b></h6>
                  <p className="mb-1">605, RATAN ICON BUILDING</p>
                  <p>SEAWOODS SECTOR</p>
                </div>
              </div>
              <div className="row ">
                <div className="col-xl-8 col-md-4 col-sm-4 col-auto my-md-0 mt-5 order-sm-1 order-3 align-self-end">
                  <p className="social text-muted mb-0 pb-0 bold-text"> <span className="mx-2"><i className="fa fa-facebook" aria-hidden="true"></i></span> <span className="mx-2"><i className="fa fa-linkedin-square" aria-hidden="true"></i></span> <span className="mx-2"><i className="fa fa-twitter" aria-hidden="true"></i></span> <span className="mx-2"><i className="fa fa-instagram" aria-hidden="true"></i></span> </p><small className="rights"><span>&#174;</span> Pepper All Rights Reserved.</small>
                </div>
                <div className="col-xl-2 col-md-4 col-sm-4 col-auto order-1 align-self-end ">
                  <h6 className="mt-55 mt-2 text-muted bold-text"><b>ANIRUDH SINGLA</b></h6><small> <span><i className="fa fa-envelope" aria-hidden="true"></i></span> anirudh@gmail.com</small>
                </div>
                <div className="col-xl-2 col-md-4 col-sm-4 col-auto order-2 align-self-end mt-3 ">
                  <h6 className="text-muted bold-text"><b>RISHABH SHEKHAR</b></h6><small><span><i className="fa fa-envelope" aria-hidden="true"></i></span> rishab@gmail.com</small>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

    </>
  )
};


export default Dashboard;
