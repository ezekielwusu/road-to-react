// version using API
import React, { Component } from 'react'
import './App.css'

const DEFAULT_QUERY = 'redux'
const DEFAULT_HPP = '100'

const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page='
const PARAM_HPP = 'hitsPerPage='
// const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`

const largeColumn = {
    width: '40%'
}

const midColumn = {
    width: '30%'
}

const smallColumn = {
    width: '10%'
}

// const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase())

// const Table = ({list, pattern, onDismiss}) =>
const Table = ({list, onDismiss}) =>
    <div className="table">
        {/* removing the filter functionality because there will be no client-side filter(search) anymore */}
        {/* {list.filter(isSearched(pattern)).map(item =>     */}
        {list.map(item =>    
        <div key={item.objectID} className="table-row">
            <span style={largeColumn}>
            <a href={item.url}>{item.title}</a>
            </span>
            <span style={midColumn}>{item.author}</span>
            <span style={smallColumn}>{item.num_comments}</span>
            <span style={smallColumn}>{item.points}</span>
            <span style={smallColumn}>
            <Button
              onClick={() => onDismiss(item.objectID)}
              className="button-inline"
            >
            Dismiss
            </Button>
            </span>
        </div>)}
    </div>

const Search = ({value, onChange, onSubmit, children}) => 
    <form onSubmit={onSubmit}>
        {children}
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="search title here"
        />
        <button type="submit">
          {children}
        </button>
    </form>

const Button = ({onClick, className = '', children}) => <button type="button"> {children}  </button>

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    }

    this.setSearchTopStories = this.setSearchTopStories.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
    this.onSearchSubmit = this.onSearchSubmit.bind(this)
    this.onDismiss = this.onDismiss.bind(this)
  }

  setSearchTopStories(result) {
    // this.setState({result})
    //functionality to concatenate old and new list of hits from the local state and new result object instead of just overriding the previous page of data
    const {hits, page} = result
    const oldHits = page !== 0
    ? this.state.result.hits
    : []

    const updatedHits = [
      ...oldHits,
      ...hits
    ]

    this.setState({
      result: {hits: updatedHits, page}
    })
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(error => error)
  }

  componentDidMount() {
    const {searchTerm} = this.state
    this.fetchSearchTopStories(searchTerm)
  }

  onSearchChange=(e)=>{
    this.setState({searchTerm: e.target.value})
  }

  onSearchSubmit(event){
    console.log('search button is working')
    const {searchTerm} = this.state
    this.fetchSearchTopStories(searchTerm)
    event.preventDefault()
  }

  onDismiss(id) {
    const isNotId = listItem => listItem.objectID !== id
    const updatedHits = this.state.result.hits.filter(isNotId)
    this.setState({
      result: {...this.state.result, hits: updatedHits}
      // result: Object.assign({}, this.state.result, {hits: updatedHits})
    })
 }

  render() {
    // console.log(this.state);
    const {result, searchTerm} = this.state
    const page = (result && result.page) || 0
    // if(!result) {return null}

    return(
      <div className="page">
        <div className="interactions">
            <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>More</Button>
            <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
            >
            Search
            </Search>
        </div>
        { result && 
          <Table
            list={result.hits}
            // pattern={searchTerm}
            onDismiss={this.onDismiss}
        />
        }
      </div>
    )
  }
}
export default App;
