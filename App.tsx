import React from "react";
import "./App.scss";
import { createApiClient, Ticket, totalTicket, sortedArray,upDate } from "./api";
import ticketLogo from "../src/TicketList.png";
import rightArrowLogo from "../src/rightArrow.png";
import leftArrowLogo from "../src/leftArrow.png";
import reverseLogo from "../src/change.png";

export type AppState = {
  tickets?: Ticket[];
  search: string;
  hiddenTickets: number;
  hiddenTicketArry?: Ticket[];
  fontSize: number;
  sortBy: string;
  page: number;
  totalTickets: number;
};

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {
  state: AppState = {
    search: "",
    hiddenTickets: 0,
    hiddenTicketArry: [],
    fontSize: 16,
    sortBy: "",
    page: 1,
    totalTickets: 0,
  };

  searchDebounce: any = null;

  async componentDidMount() {
    this.setState({
      tickets: await api.getTickets("", 1),
    });
    console.log(totalTicket);
  }

  renderTickets = (tickets: Ticket[]) => {
    const filteredTickets = tickets.filter((t) =>
      (t.title.toLowerCase() + t.content.toLowerCase()).includes(
        this.state.search.toLowerCase()
      )
    );

    return (
      <ul className="tickets">
        {filteredTickets.map((ticket) => (
          <li key={ticket.id} className="ticket" ref="ticketBody">
            <button id="hide" onClick={() => this.handleHide(ticket.id)}>
              Hide
            </button>
            <button id="submit" onClick={() => this.handleAnswer(ticket)}>
              Answer
            </button>
            <h5 className="title" style={{ fontSize: this.state.fontSize }}>
              {ticket.title}
            </h5>
            <p
              className="content"
              style={{ fontSize: this.state.fontSize - 2 }}
            >
              {ticket.content}
            </p>
            
            <footer>
              <div className="meta-data">
                By {ticket.userEmail} |{" "}
                {new Date(ticket.creationTime).toLocaleString()}
              </div>
            </footer>
          </li>
        ))}
      </ul>
    );
  };

  // hide/restore functions
  handleHide = (id: string) => {
    if (this.state.tickets && this.state.hiddenTicketArry) {
      const newT = this.state.tickets.filter((ticket) => ticket.id !== id);
      const newH = this.state.tickets.filter((ticket) => ticket.id === id);
      var margeT = this.state.hiddenTicketArry.concat(newH);
      this.setState({
        tickets: newT,
        hiddenTicketArry: margeT,
        hiddenTickets: this.state.hiddenTickets + 1,
      });
    }
  };

  handleRestore = () => {
    if (this.state.tickets && this.state.hiddenTicketArry) {
      var margeT = this.state.hiddenTicketArry.concat(this.state.tickets);
      this.setState({
        hiddenTicketArry: [],
        tickets: margeT,
        hiddenTickets: 0,
      });
    }
  };

  // change font size functions
  resetFontSize = () => {
    this.setState({ fontSize: 16 });
  };

  deFontSize = () => {
    this.setState({ fontSize: 10 });
  };

  inFontSize = () => {
    this.setState({ fontSize: 20 });
  };

  handleSortBy = async (sortBy: string) => {
    this.setState({
      tickets: await api.getTickets(sortBy),
    });
  };

  // part 3 - nav- buttons & answer box
  handleNav = async (nav: string) => {
    var curPage = this.state.page;
    if (nav == "left") {
      curPage = curPage - 1;
    } else {
      curPage = curPage + 1;
    }
    var curTickets = sortedArray.slice((curPage - 1) * 20, curPage * 20);
    this.setState({
      tickets: curTickets,
      page: curPage,
    });
  };

  handleAnswer = (ticket: Ticket) => {
    const curTicket = document.querySelector(".ticket") as Element;
    const answer = String(
      window.prompt("Type an answer to: " + ticket.userEmail, "")
    );
    upDate(ticket,answer);
  }

  handleReverse = () => {
    sortedArray.reverse();
    var curTickets = sortedArray.slice(
      (this.state.page - 1) * 20,
      this.state.page * 20
    );
    this.setState({
      tickets: curTickets,
    });
  };

  onSearch = async (val: string, newPage?: number) => {
    clearTimeout(this.searchDebounce);

    this.searchDebounce = setTimeout(async () => {
      this.setState({
        search: val,
      });
    }, 300);
  };

  render() {
    const { tickets } = this.state;

    return (
      <main>
        <h1>
          <img src={ticketLogo} />
        </h1>

        <header id="searchi">
          <input
            type="search"
            placeholder="Search..."
            onChange={(e) => this.onSearch(e.target.value)}
          />
        </header>
        <div className="Bs">
          Font size:
          <button id="small" onClick={() => this.deFontSize()}>
            Small
          </button>
          <button id="normal" onClick={() => this.resetFontSize()}>
            Normal
          </button>
          <button id="large" onClick={() => this.inFontSize()}>
            Large
          </button>
        </div>
        <div className="sort">
          <span>sort by: </span>
          <button id="date" onClick={() => this.handleSortBy("date")}>
            Date
          </button>
          <button id="email" onClick={() => this.handleSortBy("email")}>
            Email
          </button>
          <button id="title" onClick={() => this.handleSortBy("title")}>
            Title
          </button>
        </div>

        {tickets ? (
          <div className="results">
            Showing {tickets.length} results out of {totalTicket}&nbsp; (
            {this.state.hiddenTickets} hidden tickets -{" "}
            <button id="restore" onClick={() => this.handleRestore()}>
              {" "}
              restore
            </button>
            ){" "}
            <button id="reverse" onClick={() => this.handleReverse()}>
              <img src={reverseLogo} />
            </button>
          </div>
        ) : null}
        {tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
        <div className="NB">
          {this.state.page > 1 && (
            <button id="leftNav" onClick={() => this.handleNav("left")}>
              <img src={leftArrowLogo} />
            </button>
          )}{" "}
          &nbsp;Page: {this.state.page}&nbsp;
          {this.state.page < totalTicket / 20 && (
            <button id="rightNav" onClick={() => this.handleNav("right")}>
              <img src={rightArrowLogo} />
            </button>
          )}
        </div>
      </main>
    );
  }
}

export default App;
