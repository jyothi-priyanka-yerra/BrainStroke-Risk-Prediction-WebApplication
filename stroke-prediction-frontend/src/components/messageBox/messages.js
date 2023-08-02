import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

import '../../App.css';

class Mailbox extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading : true,
        error : null,
        value : null,
        index : -1
      };
    }

    componentDidMount() {
        this.getDetails();
    }
    getText(){
        if (this.state.index > -1){
            return this.state.value[this.state.index].context;
        }
        return '';
    }
    getTitle(){
        if (this.state.index > -1){
            return this.state.value[this.state.index].subject;
        }
        return '';
    }
    updateLeft(index){
        console.log(index);
        this.setState({index : index});
    }
    getCol(index,type){
      if (this.state.index === index){
        if (type === 1){
          return "#E0DDFF";
        }
        else if (type === 2){
          return "#F0F0F0";
        }
        else if (type === 3){
          return 1;
        }
      }
      if (type === 1){
        return "#D0CCFF";
      }
      else if (type === 2){
        return "#E4E4E4";
      }
      else if (type === 3){
        return 0;
      }
    }
    isSelected(){
      if (this.state.index !== -1){
        return '#EFEFEF';
      }
    }

    getDetails(){
        this.setState({index : -1});
        const url = 'https://stroke-prediction-app-backend.herokuapp.com/getMessageInbox';
        console.log('Fetching data');
        fetch(url).then(
            (resp) => resp.json())
            .then((resp) => {
            console.log("Data has been fetched successfully: ", resp);
            this.setState({
                value : resp,
                loading : false,
            });
            }
        ).catch(error => {
            console.log("ERROR:",error);
            this.setState({
            error : error,
            //value : sample,
            loading : false
            })
        })
    }

    render() {
        if (this.state.loading) {
          return <CircularProgress></CircularProgress>;
        }
        if (this.state.error) {
          console.log(this.state.error.message);
          return this.state.error.message;
        }
        return (

            <div class="row">
                <div class="column left scroll">
                    {this.state.value.map((message, idx) => (
                        <div>
                      <Box
                        sx={{
                          alignItems: 'center',
                          borderRadius: '12px',
                          bgcolor:this.getCol(idx,1),
                          border: this.getCol(idx,3),
                          borderColor: 'primary.main',
                        }}
                        onClick={() => this.updateLeft(idx) }
                      >
                        <Box sx={{
                          bgcolor:this.getCol(idx,1),
                          textAlign: "left",
                          borderRadius: '6px',
                          p: '3px',
                        }}>
                          <Typography
                            color="textPrimary"
                            variant="h6"
                          >
                              {message.subject}
                          </Typography>
                        </Box>
                        <Box sx={{
                          bgcolor:this.getCol(idx,2),
                          textAlign: "left",
                          borderRadius: '6px',
                          p:'3px',
                        }}>
                          <Typography
                            color="textPrimary"
                            variant="body"
                          >
                              {message.context.slice(0,150) + "..."}
                          </Typography>
                        </Box>
                      </Box>
                      <br />
                      </div>
                    ))}
                </div>
                <div class="column right borderBig">
                  <Box sx={{
                  }}>
                  <Box sx={{
                          bgcolor:this.isSelected(),
                          textAlign: "left",
                          p:'3px',
                        }}>
                    <Typography
                      color="textPrimary"
                      variant="h4"
                    >
                        {this.getTitle()}
                    </Typography>
                  </Box>
                  <br />
                  <Box sx={{
                          textAlign: "left",
                          p:'3px',
                        }}>
                    <Typography
                      color="textPrimary"
                      variant="body"
                    >
                        {this.getText()}
                    </Typography>
                  </Box>
                  </Box>
                </div>
            </div>

        );
    }

}


export default Mailbox;