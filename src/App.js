import React, { useEffect, useState } from 'react';
import './index.scss';
import { Collection } from './Collection ';
import axios from 'axios';



function App() {

  const cats = [
    { "name": "Все" },
    { "name": "Море" },
    { "name": "Горы" },
    { "name": "Архитектура" },
    { "name": "Города" }
  ]

  const [collections, setCollections] = useState([])
  const [searchVal, setSearchVal] = useState('')
  const [categoryId, setCategoryId] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)

  const categoryUrl = categoryId ? `category=${categoryId}` : ''

  async function getCollection() {
    try {
      setIsLoading(true)
      const response = await axios.get(`https://65b1217bd16d31d11bde27fc.mockapi.io/photo_collections?page=${page}&limit=3&${categoryUrl}`);
      setCollections(response.data)
    } catch (error) {
      console.error(error);
      alert('не удалось получить информацию')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getCollection()
  }, [categoryId, page])

  return (
    <div className="App">
      <h1>Моя коллекция фотографий</h1>
      <div className="top">
        <ul className="tags">
          {cats.map((obj, index) =>
            <li
              onClick={() => {
                setCategoryId(index)
                setPage(1)
              }}
              key={obj.name}
              className={categoryId === index ? 'active' : ''}
            >
              {obj.name}
            </li>
          )}
        </ul>
        <input
          value={searchVal}
          onChange={(event) => setSearchVal(event.target.value)}
          className="search-input"
          placeholder="Поиск по названию"
        />
      </div>
      <div className="content">
        {isLoading
          ?
          (<h2>LOADING...</h2>)
          :
          (collections
            .filter((obj) => {
              return obj.name.toLowerCase().includes(searchVal.toLowerCase())
            })
            .map((obj) =>
              <Collection
                key={obj.name}
                name={obj.name}
                images={obj.photos}
              />
            ))
        }
      </div>
      <ul className="pagination">
        {
          [...Array(5)]
            .map((_, i) =>
              <li
                key={i}
                onClick={() => setPage(i + 1)}
                className={page === (i + 1) ? 'active' : ''}
              >
                {i + 1}
              </li>
            )
        }
      </ul>
    </div>
  );
}

export default App;
