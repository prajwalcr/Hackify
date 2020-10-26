import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import QuillEditor from "./QuillEditor";
import {loadUser} from "../actions/authActions";
import {getProject, addProject, updateProject} from "../actions/projectActions";
import { Redirect } from 'react-router-dom';

class CreateProject extends Component {

  componentDidMount(){
    console.log(this.props.isAuthenticated);
    if(this.props.match.params.id){
      const projectId = this.props.match.params.id; 
      if(projectId)
      {
        this.props.getProject(projectId);
        if(this.props.projects){
          this.setState({
            content: this.props.projects[0].content,
            title: this.props.projects[0].title,
            author: this.props.projects[0].author,
            isExisting: true,
          });
        }
      }
    }
  }

  constructor(props){
    super(props);
    this.state = {
      content: "",
      files: [],
      title: "",
      action: "",
    }
  }

  myChange = (e) => {
    this.setState({title: e.target.value});
  }

  onEditorChange = (content) => {
    this.setState({content: content});
    console.log("Content:", content)
  }

  onFilesChange = (files) => {
    this.setState({files: files});
  }

  myAction = (e) => {
    this.setState({action: e.target.name});
  }

  onSubmit = (e) => {
    e.preventDefault();

    let isPublic = false;
    const {title, content} = this.state;

    const isExisting = this.props.location.pathname !== "/create/project";

    if(isExisting){
      this.props.getProject(this.props.match.params.id);
      isPublic = this.state.action === "publish" || this.props.projects[0].isPublic;
    }

    const _id = this.props.match.params.id || "";
  
    const project = {
      _id: _id,
      title: title,
      content: content,
      author: this.props.user._id,
      isPublic: isPublic,
    }

    if(!isExisting){
      this.props.addProject(project);
    }
    else{
      this.props.updateProject(project);
    }
  }

  render() {
    return (
      <div>
        {this.props.location.pathname === "/create/project" && this.props.projects[0]? <Redirect to={`/edit/${this.props.projects[0]._id}`} />: null}
        <form onSubmit={this.onSubmit}>
          <p>title:</p>
          <input type="text" name="title" onChange={this.myChange} />
          <br />
          <QuillEditor
            placeholder={"Start Posting Something"}
            onEditorChange={this.onEditorChange}
            onFilesChange={this.onFilesChange}
          />
          <input type="submit" name="save" value="Save" onClick={this.myAction}/>
          <input type="submit" name="publish" value="Publish" onClick={this.myAction}/>
        </form>
      </div>
    );
  }
}

CreateProject.propTypes = {
  updateProject: PropTypes.func.isRequired,
  addProject: PropTypes.func.isRequired,
  getProject: PropTypes.func.isRequired,
  loadUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  projects: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  projects: state.project.projects,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, { loadUser, getProject, addProject, updateProject })(CreateProject);
