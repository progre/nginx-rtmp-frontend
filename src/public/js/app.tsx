/// <reference path="./typings.d.ts" />
//Reactコンポーネントの生成
var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        Hello, world!I am a CommentBox.
        </div>
    );
  }
});

React.render(
  <CommentBox />,
  document.getElementById('content')
);
