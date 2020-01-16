import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import Masonry from "react-masonry-css";
import { Search } from "../store/actions/SearchAction";
import { AddGif } from "../store/actions/AddGif";
import Infinity from "../Assets/Gif/Infinity.gif";

import request from "superagent";
import debounce from "lodash.debounce";

import "./Home.css";

class Home extends Component {
  state = {
    word: "",
    apikey: "Fbyn0BEfZLG1S86nioZbkFKa3SqOlcO8",
    limit: 20,
    offset: 0,
    error: false,
    hasMore: true,
    isLoading: false,
    total: 0
  };
  handleChange = e => {
    this.setState({
      word: e.target.value
    });
  };

  componentDidMount() {
    window.onscroll = debounce(() => {
      const {
        state: { error, isLoading, hasMore }
      } = this;

      // Bails early if:
      // * there's an error
      // * it's already loading
      // * there's nothing left to load
      if (error || isLoading || !hasMore) return;

      // Checks that the page has scrolled to the bottom
      console.log(
        window.innerHeight + document.documentElement.scrollTop,
        document.documentElement.offsetHeight
      );
      if (
        window.innerHeight + document.documentElement.scrollTop >
        document.documentElement.offsetHeight - 500
      ) {
        this.SearchApi(
          this.state.apikey,
          this.state.limit,
          this.state.offset,
          this.state.word
        );
      }
    }, 100);
    console.log(this.props);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.gifs !== this.props.gifs) {
      console.log(this.props);
    }
  }

  SearchApi = (apiKey, limit, offset, word) => {
    console.log("satrat");
    let newWord = word.replace(" ", "+");
    const url = `http://api.giphy.com/v1/gifs/search?q=${newWord}&api_key=${apiKey}&limit=${limit}&offset=${offset}`;
    this.setState(
      {
        isLoading: true
      },
      () => {
        try {
          fetch(url)
            .then(response => {
              return response.json();
            })
            .then(response => {
              console.log(response);
              this.setState(
                {
                  gifs: response.data,
                  offset: this.state.offset + this.state.limit,
                  isLoading: false,
                  total: response.pagination.total_count,
                  hasMore:
                    response.pagination.total_count > this.props.gifs.length
                      ? true
                      : false
                },
                () => {
                  console.log(this.state);
                  this.props.search(this.state.gifs);
                }
              );
            });
        } catch (err) {
          this.setState({
            error: err
          });
        }
      }
    );
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.word) {
      this.SearchApi(
        this.state.apikey,
        this.state.limit,
        this.state.offset,
        this.state.word
      );
    }
  };

  checkGif = gif => {
    this.props.addgif(gif);
    this.props.history.push("/info");
  };
  render() {
    const breakpointColumnsObj = {
      default: 4,
      1100: 3,
      700: 2,
      500: 1
    };

    return (
      <div className="container-xl">
        <form
          onSubmit={this.handleSubmit}
          className="search-form flex ml-auto mt-16 mr-auto w-4/5"
        >
          <input
            onChange={this.handleChange}
            class="w-full h-16 px-3 rounded mr-2 focus:outline-none focus:shadow-outline text-xl px-8 shadow-lg"
            type="search"
            value={this.state.word}
            placeholder="Search..."
          />
          <input
            type="submit"
            className="submit bg-purple-200 px-4 shadow-lg rounded text-white"
          />
        </form>

        {this.state.isLoading && this.props.gifs.length === 0 && (
          <img src={Infinity} alt="" className="loader bg-white " />
        )}
        {this.state.error && <div className="text-red">{this.state.error}</div>}

        {
          <div className="gifs-collection ml-auto mt-4 mr-auto w-4/5">
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {this.props.gifs &&
                this.props.gifs.map((item, index) => {
                  return (
                    <div
                      onClick={() => {
                        this.checkGif(item);
                      }}
                      key={item.id}
                      className="shadow-xl rounded-lg bg-purple-200 text-white"
                    >
                      <img
                        style={{
                          width: item.images.downsized_small.width,
                          height: item.images.downsized_small.height
                        }}
                        src={item.images.downsized.url}
                        alt=""
                        className="gify rounded-lg bg-purple-200"
                      />
                    </div>
                  );
                })}
            </Masonry>
          </div>
        }
        {this.state.isLoading && this.state.total > this.props.gifs.length && (
          <img src={Infinity} alt="" className="loader bg-white " />
        )}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    search: word => {
      dispatch(Search(word));
    },
    addgif: gif => {
      dispatch(AddGif(gif));
    }
  };
};

const mapStateToProps = state => {
  return {
    gifs: state.gifs
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
