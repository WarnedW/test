import './charList.scss';

import React from 'react'

import MarvelService from '../../services/MarvelService'
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

class CharList extends React.Component {
    state = {
        chars: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    onListLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        this.setState(({offset, chars}) => (
                {
                    chars: [...chars, ...newChars],
                    loading: false,
                    newItemLoading: false,
                    offset: offset + 9,
                    charEnded: ended
                }
            )
        )
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onError = () => {
        this.setState(
            {
                loading: false,
                error: true
            }
        )
    }

    itemRefs = [];

    setRef = (ref) => {  
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }
 
    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onListLoaded)
            .catch(this.onError)
    }

    render () {
        const {chars, loading, error, newItemLoading, offset, charEnded} = this.state

        const spinner = loading ? <Spinner/> : null
        const errorMessage = error ? <ErrorMessage/> : null
        const content = !(loading || error) ? <List chars={chars} 
        onCharSelected={this.props.onCharSelected}
        focusOnItem={this.focusOnItem}
        setRef={this.setRef}/> : null

        return (
            
            <div className="char__list">
            {spinner}
            {errorMessage}
            <ul className="char__grid">
            {content}
            </ul>
            <button disabled={newItemLoading} 
            onClick={() => this.onRequest(offset)}
            style={{'display': charEnded ? 'none' : 'block'}}
            className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
            </div>
        )
    }
}

export default CharList;

const List = (props) => {
    const {chars, onCharSelected, focusOnItem, setRef} = props
    return (
        chars.map((char, i) => 
            <li className="char__item" key={char.id} 
                tabIndex={0}
                ref={setRef}
                onClick={() => {
                    onCharSelected(char.id);
                    focusOnItem(i);
                }}

                onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === "Enter") {
                        onCharSelected(char.id);
                        focusOnItem(i);
                    }
                }}>
                
                <img src={char.thumbnail} 
                style={{objectFit:char.thumbnail.includes('image_not_available') ? 'contain' : null}} 
                alt="char"/>
                <div className="char__name">{char.name}</div>
            </li>
        )
    )
}
