import axios from "axios";
import { APIRootPath } from "@fed-exam/config";


export type Ticket = {
  id: string;
  title: string;
  content: string;
  creationTime: number;
  userEmail: string;
  labels?: string[];
  answer?: string;
};



export type ApiClient = {
  getTickets: (sortBy?: string, page?: number) => Promise<Ticket[]>;
};

axios
  .get("/user", {
    params: {
      ID: 12345,
    },
  })
  .then(function (response) {
    console.log(response);
  });





export const createApiClient = (): ApiClient => {
  return {
    getTickets: (sortBy?: string, page?: number) => {
      //Axios is a promise based HTTP client for the browser and Node. js. Axios makes it easy to send asynchronous HTTP requests to REST endpoints and perform CRUD operations. 
      //It can be used in plain JavaScript or with a library such as Vue or React.
      return axios
        .get(APIRootPath, {
          params: { page },
        })
        .then((res) => {
          var unsortedTickets: Ticket[] = res.data.tempData;
          sortedArray= res.data.tempData;
          totalTicket = res.data.x;
          if (sortBy) {
            if (sortBy == "date") {
              sortedArray = unsortedTickets.sort((a, b) => {
                if (a.creationTime > b.creationTime) {
                  return 1;
                }
                if (a.creationTime < b.creationTime) {
                  return -1;
                }
                return 0;
              }); //end sort by date
              var curTP = sortedArray.slice((res.data.page - 1) * 20, res.data.page * 20);//current tickets in the current page
              return curTP;
            } else if (sortBy == "email") {
              sortedArray = unsortedTickets.sort((a, b) => {
                if (a.userEmail > b.userEmail) {
                  return 1;
                }
                if (a.userEmail < b.userEmail) {
                  return -1;
                }
                return 0;
              }); //end sort by email

              var curTP = sortedArray.slice((res.data.page - 1) * 20, res.data.page * 20);
              return curTP;
            } else {
              //sortBy=== title
              sortedArray = unsortedTickets.sort((a, b) => {
                if (a.title> b.title) {
                  return 1;
                }
                if (a.title < b.title) {
                  return -1;
                }
                return 0;
              }); //end sort by title
              var curTP = sortedArray.slice((res.data.page - 1) * 20, res.data.page * 20);
              return curTP;
            }
          } // end if sortBy != null
          return res.data.paginatedData;
        }); 
    }
  }; 
};


export const upDate=(ticket:Ticket,answer:string)=>{
  console.log("enterd update function");
return  axios
.patch(APIRootPath
  ,
  {
        id: ticket.id,
        title: ticket.title,
        content: ticket.content,
        userEmail: ticket.userEmail,
        creationTime: ticket.creationTime,
        labels:ticket.labels,
        answer: answer

  }
)
.then(res => console.log("submited answer"))
.catch(err => console.error(err));
}



export var totalTicket: number;
export var sortedArray: Ticket[];

