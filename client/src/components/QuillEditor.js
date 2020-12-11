import React from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import axios from "axios";

const QuillClipboard = Quill.import("modules/clipboard");

class Clipboard extends QuillClipboard {
	getMetaTagElements = (stringContent) => {
		const el = document.createElement("div");
		el.innerHTML = stringContent;
		return el.getElementsByTagName("meta");
	};

	async onPaste(e) {
		let clipboardData = e.clipboardData || window.clipboardData;
		let pastedData = await clipboardData.getData("Text");

		const urlMatches = pastedData.match(/\b(http|https)?:\/\/\S+/gi) || [];
		if (urlMatches.length > 0) {
			e.preventDefault();
			urlMatches.forEach((link) => {
				axios
					.get(link)
					.then((payload) => {
						let title, image, url;
						for (let node of this.getMetaTagElements(payload)) {
							if (node.getAttribute("property") === "og:title") {
								title = node.getAttribute("content");
							}
							if (node.getAttribute("property") === "og:image") {
								image = node.getAttribute("content");
							}
							if (node.getAttribute("property") === "og:url") {
								url = node.getAttribute("content");
							}
						}

						const rendered = `<a href=${url} target="_blank"><div><img src=${image} alt=${title} width="20%"/><span>${title}</span></div></a>`;

						let range = this.quill.getSelection();
						let position = range ? range.index : 0;
						this.quill.pasteHTML(position, rendered, "silent");
						this.quill.setSelection(position + rendered.length);
					})
					.catch((error) => console.error(error));
			});
		} else {
			super.onPaste(e);
		}
	}
}
Quill.register("modules/clipboard", Clipboard, true);

const BlockEmbed = Quill.import("blots/block/embed");

class ImageBlot extends BlockEmbed {
	static create(value) {
		const imgTag = super.create();
		imgTag.setAttribute("src", value.src);
		imgTag.setAttribute("alt", value.alt);
		imgTag.setAttribute("width", "100%");
		return imgTag;
	}

	static value(node) {
		return { src: node.getAttribute("src"), alt: node.getAttribute("alt") };
	}
}

ImageBlot.blotName = "image";
ImageBlot.tagName = "img";
Quill.register(ImageBlot);

class VideoBlot extends BlockEmbed {
	static create(value) {
		if (value && value.src) {
			const videoTag = super.create();
			videoTag.setAttribute("src", value.src);
			videoTag.setAttribute("title", value.title);
			videoTag.setAttribute("width", "100%");
			videoTag.setAttribute("controls", "");

			return videoTag;
		} else {
			const iframeTag = document.createElement("iframe");
			iframeTag.setAttribute("src", value);
			iframeTag.setAttribute("frameborder", "0");
			iframeTag.setAttribute("allowfullscreen", true);
			iframeTag.setAttribute("width", "100%");
			return iframeTag;
		}
	}

	static value(node) {
		if (node.getAttribute("title")) {
			return { src: node.getAttribute("src"), alt: node.getAttribute("title") };
		} else {
			return node.getAttribute("src");
		}
	}
}

VideoBlot.blotName = "video";
VideoBlot.tagName = "video";
Quill.register(VideoBlot);

class QuillEditor extends React.Component {
	bandId;
	placeholder;
	onEditorChange;
	onFilesChange;
	_isMounted;

	constructor(props) {
		super(props);

		this.state = {
			editorHtml: "",
			files: [],
		};

		this.reactQuillRef = null;

		this.inputOpenImageRef = React.createRef();
		this.inputOpenVideoRef = React.createRef();
	}

	componentDidMount() {
		this._isMounted = true;
	}

	componentDidUpdate(prevProps) {
		if (this.props.projects !== prevProps.projects) {
			if (this.props.projects[0]) {
				console.log("Mounting", this.props.projects[0].content);
				this.setState({ editorHtml: this.props.projects[0].content });
			}
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	handleChange = (html) => {
		console.log("html", html);

		this.setState(
			{
				editorHtml: html,
			},
			() => {
				this.props.onEditorChange(this.state.editorHtml);
			},
		);
	};

	imageHandler = () => {
		this.inputOpenImageRef.current.click();
	};

	videoHandler = () => {
		this.inputOpenVideoRef.current.click();
	};

	insertImage = (e) => {
		e.stopPropagation();
		e.preventDefault();

		if (
			e.currentTarget &&
			e.currentTarget.files &&
			e.currentTarget.files.length > 0
		) {
			const file = e.currentTarget.files[0];

			let formData = new FormData();
			const config = {
				header: { "content-type": "multipart/form-data" },
			};
			formData.append("file", file);

			axios
				.post("/api/projects/uploadfiles", formData, config)
				.then((response) => {
					if (response.data.success) {
						const quill = this.reactQuillRef.getEditor();
						quill.focus();

						let range = quill.getSelection();
						let position = range ? range.index : 0;

						quill.insertEmbed(position, "image", {
							src: "http://localhost:5000/" + response.data.url,
							alt: response.data.fileName,
						});
						quill.setSelection(position + 1);

						if (this._isMounted) {
							this.setState(
								{
									files: [...this.state.files, file],
								},
								() => {
									this.props.onFilesChange(this.state.files);
								},
							);
						}
					} else {
						return alert("failed to upload file");
					}
				});
		}
	};

	insertVideo = (e) => {
		e.stopPropagation();
		e.preventDefault();

		if (
			e.currentTarget &&
			e.currentTarget.files &&
			e.currentTarget.files.length > 0
		) {
			const file = e.currentTarget.files[0];

			let formData = new FormData();
			const config = {
				header: { "content-type": "multipart/form-data" },
			};
			formData.append("file", file);

			axios
				.post("/api/projects/uploadfiles", formData, config)
				.then((response) => {
					if (response.data.success) {
						const quill = this.reactQuillRef.getEditor();
						quill.focus();

						let range = quill.getSelection();
						let position = range ? range.index : 0;
						quill.insertEmbed(position, "video", {
							src: "http://localhost:5000/" + response.data.url,
							title: response.data.fileName,
						});
						quill.setSelection(position + 1);

						if (this._isMounted) {
							this.setState(
								{
									files: [...this.state.files, file],
								},
								() => {
									this.props.onFilesChange(this.state.files);
								},
							);
						}
					} else {
						return alert("failed to upload file");
					}
				});
		}
	};

	render() {
		return (
			<div>
				<div id='toolbar'>
					<select
						className='ql-header'
						defaultValue={""}
						onChange={(e) => e.persist()}
					>
						<option value='1' />
						<option value='2' />
						<option value='' />
					</select>
					<button className='ql-bold' />
					<button className='ql-italic' />
					<button className='ql-underline' />
					<button className='ql-strike' />
					<button className='ql-insertImage'>I</button>
					<button className='ql-insertVideo'>V</button>

					<button className='ql-link' />
					<button className='ql-code-block' />
					<button className='ql-video' />
					<button className='ql-blockquote' />
					<button className='ql-clean' />
				</div>
				<ReactQuill
					ref={(el) => {
						this.reactQuillRef = el;
					}}
					theme={"snow"}
					onChange={this.handleChange}
					modules={this.modules}
					formats={this.formats}
					value={this.state.editorHtml}
					placeholder={this.props.placeholder}
				/>
				<input
					type='file'
					accept='image/*'
					ref={this.inputOpenImageRef}
					style={{ display: "none" }}
					onChange={this.insertImage}
				/>
				<input
					type='file'
					accept='video/*'
					ref={this.inputOpenVideoRef}
					style={{ display: "none" }}
					onChange={this.insertVideo}
				/>
			</div>
		);
	}

	modules = {
		syntax: false,
		toolbar: {
			container: "#toolbar",
			handlers: {
				insertImage: this.imageHandler,
				insertVideo: this.videoHandler,
			},
		},
	};

	formats = [
		"header",
		"bold",
		"italic",
		"underline",
		"strike",
		"image",
		"video",
		"link",
		"code-block",
		"video",
		"blockquote",
		"clean",
	];
}

QuillEditor.propTypes = {
	projects: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
	projects: state.project.projects,
});

export default connect(mapStateToProps, null)(QuillEditor);
