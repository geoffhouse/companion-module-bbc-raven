exports = module.exports = function() {

    var self = this;
    var presets = [];

    var bgcolor_gray = '5986649';
    var pngImages = {
      record_monitor: 'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAABCJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjcyPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj41ODwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxkYzpzdWJqZWN0PgogICAgICAgICAgICA8cmRmOkJhZy8+CiAgICAgICAgIDwvZGM6c3ViamVjdD4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjAtMDMtMTFUMDc6MDM6MTY8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy45PC94bXA6Q3JlYXRvclRvb2w+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgp7zW19AAAAzUlEQVR4Ae3ZsQ3CQBAEQIxoiYZol6Lgk99oJUdHYOYTr9bSWR4nlu52cwgQIECAAAECBAgQIECAAAEClxI4pt/ms87UM451pmbvufcdXLsAoO6SFlAoegDUXdICCkUPgLpLWkCh6AFQd0kLKBQ9AOouaQGFogdA3SUtoFD0AKi7pAUUih4AdZe0j6S58JobbTIBAgSuLTC+FVhLjfcU4VpqPKdm77m/ALL22dpXvPpRPPmqgACdCLhNgAABAgQIECBAgAABAgQIEPgvgS9aNgySnRQqfgAAAABJRU5ErkJggg==',
      record_chunk: 'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAABCJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjcyPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj41ODwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxkYzpzdWJqZWN0PgogICAgICAgICAgICA8cmRmOkJhZy8+CiAgICAgICAgIDwvZGM6c3ViamVjdD4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjAtMDMtMTFUMDg6MDM6NDY8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy45PC94bXA6Q3JlYXRvclRvb2w+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgrUddB4AAAC7klEQVR4Ae2Zu4oUURCGZ9x1vaPCgKCYCr6AiYEIhqYGGm2qsZgJow9gpA9gJKggrKGXWBAzYdkH8IKKiq6yF9nxK+mGcaZO76mZsu0e6kAxPdVV1fV/fe/T6cQIAkEgCASBIBAEgkAQCAJBIAgEgSAQBILATBHo1qlmMBicZHsXsDPYMewodqjb7W7x+9cgdhnHAvYOe40tYc+JXeN3tgZiT2EvMG3Ma2oJfKsEr+K7hfW0nNb5EDKP3ca2sNRIAfqYSsD/DbuK1XoGuO4Amt+FPcK2GylAn7dLZP1DbL9r43UVo/EHGQIlJAVIjpKc8YqgdkGi4cUcZUXMnLbTWPfDUGOJ2B1ancb5aLSH5e59YaAKw78mKw2j/y9gqM1NuaHL5B+Ysoakq0dWRd1rwDxesf7/r6LBBey9Ya9LqHonwl9150tt4q43Be8j6DQNHrE0yYPfIBF/M+Gvcl+E3MGqAOs6b0DyhGwaCLqDjd3JANen0A1TsU5nJ/HnjTn1hSP0KTbJeELSYa1T/H1jwXtanUb4ELJsFDMcvsKfE5oQ/BZIL7UajfAhpOr1YBhGalmens9pYvDnQnqj5TfCh4jNlHKDX2pc0QThz4G0ruVO6vO+SH+dtBHHvE+OtXxLsYenuQbJQeZxijX6GjTpXUzgeF2kG30Xy7lGCIzR4Xmbv+R7XjhWQ/XZUeUZ/9UHRWmLXCvwDXJcn6Qd8fwR5PkuZoUj+8L9XcwVULHXr0unhqG+tZNvfVn9SU6z3+YLQNbvQTJzMTYQ+8sAWUL7Y0Wa6qDZRYO43ZoO8tcNNdrzRbEUi7j7mQL3lDnDv+TKKZMz2vdNWoSiLHdWY98wmHKZ/O8ZdNo7q1FAypkXSwH6UgFIvnm3e16sPBIKUFUzq3uHY8tlAHxQAK3iq3VmVf0eXDbp/Ys4bW6+x9fDjdFtEbuCT740lnPzj1l+NpNz86Pi438QCAJBIAgEgSAQBIJAEAgCQSAIBIEgMAWB34MN8jFLzPEmAAAAAElFTkSuQmCC',
      record_start: 'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAABCJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjcyPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj41ODwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxkYzpzdWJqZWN0PgogICAgICAgICAgICA8cmRmOkJhZy8+CiAgICAgICAgIDwvZGM6c3ViamVjdD4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjAtMDMtMTFUMDg6MDM6Njk8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy45PC94bXA6Q3JlYXRvclRvb2w+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgqrGqZTAAAByUlEQVR4Ae2ZMU7DQBBFbRDhAFGEREtouAr3ok2VS1Ck4wTcgYq0kSg4AAnI+R9sKQU2EZo/yMsf6WsjZz2z+zy73l1Xlc0ETMAETMAETMAETMAETMAETMAETMAEiiJQ/0VvmqaZIu5tqyuUlxCvvUIbaA09UHVd89r/MICZQ/fQO3SMsR7rz4smhA5OoAW0hX5jvI/3T4oDhU7NoEcowuhnVgwkdgZaR5A58EF/44eETnBYRWXOAZ/Pn/Q77uGGDnDOUNoiY6hJXvOgwrfOE3Qm7MQOvm+wDHgWxqhORM7v4FcJh82mf8aRWngGIXu44HuBTqUt/3L+geJCuZhUZBBXyBlwiIhxGE9mKkCyBn/jeHSAuLfKNGk8RQZx45lp0niKSfoNdDIXcVtM0ueqJ6LIoOzjCWk8BaCN6mn2+JXGUwDiYVemSeMpAPEkMNOk8RSTtFfSQ+nRLvtXQ3UC/1sptxlsZ3gG0al386QwYHiqPIJYDlSJ+GvZxonwle8DWeQTxZ+wA5LPpI+EFHU2XdZXjQ5eO9z8XawD0lcC1DU0qi+rktd8H6DuOiD523wHw6UJmIAJmIAJmIAJmIAJmIAJmIAJmEAwgT0HCL5g7b40dwAAAABJRU5ErkJggg==',
      record_stop: 'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAABCJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjcyPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj41ODwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxkYzpzdWJqZWN0PgogICAgICAgICAgICA8cmRmOkJhZy8+CiAgICAgICAgIDwvZGM6c3ViamVjdD4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjAtMDMtMTFUMDg6MDM6NTI8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy45PC94bXA6Q3JlYXRvclRvb2w+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpQYDCHAAAAmklEQVR4Ae3SsRHAIAwEQXD/Pdt0cAxknlX6EsHyYxgCBAgQIECAAAECBAgQIECAAAECBAjsCszdxdO9d83pbd3NNbVzmz+3D/z9HlD8MCBAIRCxBgEKgYg1CFAIRKxBgEIgYg0CFAIRaxCgEIhYgwCFQMQaBCgEItYgQCEQsQYBCgExAQIECBAgQIAAAQIECBAgQIAAAQL7Ah8VrwQuQwg/wAAAAABJRU5ErkJggg==',
      playback_stop: 'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAABCJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjcyPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj41ODwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxkYzpzdWJqZWN0PgogICAgICAgICAgICA8cmRmOkJhZy8+CiAgICAgICAgIDwvZGM6c3ViamVjdD4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjAtMDMtMTFUMDg6MDM6NTI8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy45PC94bXA6Q3JlYXRvclRvb2w+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpQYDCHAAAAmklEQVR4Ae3SsRHAIAwEQXD/Pdt0cAxknlX6EsHyYxgCBAgQIECAAAECBAgQIECAAAECBAjsCszdxdO9d83pbd3NNbVzmz+3D/z9HlD8MCBAIRCxBgEKgYg1CFAIRKxBgEIgYg0CFAIRaxCgEIhYgwCFQMQaBCgEItYgQCEQsQYBCgExAQIECBAgQIAAAQIECBAgQIAAAQL7Ah8VrwQuQwg/wAAAAABJRU5ErkJggg=='
    };
    
    presets.push(
      {
        category: 'Record Controls',
        label: "Monitor",
        bank: {
          style: 'png',
          text: '',
          size: '14',
          bgcolor: bgcolor_gray,
          png64: pngImages.record_monitor
        },
        actions: [{	
          action: 'record_monitor', 
        }],
        feedbacks: [{	
          type: 'is_monitoring', 
          options: {}
        }]
      },
      {
        category: 'Record Controls',
        label: "Start",
        bank: {
          style: 'png',
          text: '',
          size: '14',
          bgcolor: bgcolor_gray,
          png64: pngImages.record_start
        },
        actions: [{	
          action: 'record_start', 
        }],
        feedbacks: [{	
          type: 'is_recording', 
          options: {}
        }]
      },
      {
        category: 'Record Controls',
        label: "Chunk",
        bank: {
          style: 'png',
          text: '',
          size: '14',
          bgcolor: bgcolor_gray,
          png64: pngImages.record_chunk
        },
        actions: [{	
          action: 'record_chunk', 
        }]
      },
      {
        category: 'Record Controls',
        label: "Stop",
        bank: {
          style: 'png',
          text: '',
          size: '14',
          bgcolor: bgcolor_gray,
          png64: pngImages.record_stop
        },
        actions: [{	
          action: 'record_start', 
        }],
        feedbacks: [{	
          type: 'is_idle', 
          options: {}
        }]
      },

    );

    // pass the presets to companion
    self.setPresetDefinitions(presets);
};
