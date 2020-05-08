import React, { useState, useEffect } from "react";
import api from './services/api'

import "./styles.css";

function App() {

	const [repositories, setRepositories] = useState([])

	useEffect(() => {
		api.get('/repositories').then(response => {
			setRepositories(response.data)
		})
	}, [])

	async function handleAddRepository() {
		let repositoryTitle = document.getElementById('input-repository-title')
			.value || `New repository ${Date.now()}`
		let repositoryUrl =
			document.getElementById('input-repository-url').value || 'https://github.com'
		let repositoryTech1 =
			document.getElementById('input-repository-tech-1').value || 'ReactJS'
		let repositoryTech2 =
			document.getElementById('input-repository-tech-2').value || ''

		let repository = {
			title: repositoryTitle,
			url: repositoryUrl,
			techs: [
				repositoryTech1, repositoryTech2
			]
		}

		api.post('/repositories', repository)
			.then(reponse =>
				setRepositories([...repositories, reponse.data])
			)
			.catch(error => alert(error))
	}

	async function handleRemoveRepository(id) {
		api.delete(`/repositories/${id}`)
			.then(reponse => {
				let repoIndex = repositories.findIndex(repo => repo.id === id)
				repositories.splice(repoIndex, 1)

				setRepositories([...repositories])
			})
			.catch(error => alert(error))
	}

	return (
		<div className="d-flex flex-column container">
			<h1>Repositories</h1>
			<div className="d-flex">
				<div className="list">
					<h2>Repository list</h2>
					<ul id="repository-list" data-testid="repository-list">
						{
							repositories.map(repository =>
								<li id={repository.id} key={repository.id}>
									<p className="d-flex flex-column">
										<a rel="noopener noreferrer" target="_blank" href={repository.url}>
											<span>
												{repository.title}
											</span>
										</a>
										<small>Made with{
											repository.techs.map(tech => {
												if (tech.length > 0) {
													return ` ${tech};`
												}
												return ''
											})
										}</small>
									</p>
									<button onClick={() => handleRemoveRepository(repository.id)}>
										Remover
											</button>
								</li>
							)
						}
					</ul>
					{
						repositories.length === 0 && <h3>The repository list is empty</h3>
					}
				</div>
				<div className="form">
					<h2>Create new repository</h2>
					<input placeholder="Title" type="text" id="input-repository-title" />
					<input placeholder="Link to Github" type="text" id="input-repository-url" />
					<input placeholder="Tech 1" type="text" id="input-repository-tech-1" />
					<input placeholder="Tech 2" type="text" id="input-repository-tech-2" />
					<button onClick={handleAddRepository}>Adicionar</button>
				</div>
			</div>
		</div>
	);
}

export default App;
