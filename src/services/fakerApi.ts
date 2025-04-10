export default class FakerApi {
	routes = {
		'/login': function (instance: FakerApi, { username, password }) {
			instance._auth(username, password);
			return {
				success: true,
				message: 'Usuario Logado',
			};
		},
		'/logout': function (instance: FakerApi, {}) {
			instance._logout();
			return {
				success: true,
				message: 'Deslogado',
			};
		},
		'/register': function (instance: FakerApi, { name, username, password }) {
			if (!name || !username || !password) throw 'Dados invalidos';

			const users = instance._allUsers();
			if (users.filter((userMap) => userMap.username === username)[0])
				throw 'Usuario já cadastrado';

			instance._setUser({ name, username, password });
			return {
				success: true,
				message: 'Usuario cadastrado',
			};
		},
		'/me': function (instance: FakerApi, {}) {
			instance._isAuthenticate();
			return {
				success: true,
				data: instance._getAuth(),
			};
		},
		'/posts': function (instance: FakerApi, {}) {
			return {
				success: true,
				data: instance._allPosts(),
			};
		},
		'/posts/view': function (instance: FakerApi, { post_id }) {
			return {
				success: true,
				data: instance._getPost(post_id),
			};
		},
		'/posts/create': function (instance: FakerApi, { title, content }) {
			instance._setPost({ title, content });
			return {
				success: true,
				message: 'Post adicionado',
			};
		},
		'/posts/update': function (
			instance: FakerApi,
			{ post_id, post: { title, content } }
		) {
			const post = instance._getPost(post_id);
			post.title = title;
			post.content = content;
			instance._setPost(post);
			return {
				success: true,
				message: 'Post atualizado',
			};
		},
		'/posts/remove': function (instance: FakerApi, { post_id }) {
			instance._removePost(post_id);
			return {
				success: true,
				message: 'Post removido',
			};
		},
		'/comments': function (instance: FakerApi, { post_id }) {
			return {
				success: true,
				data: instance._getComments(post_id),
			};
		},
		'/comments/view': function (instance: FakerApi, { post_id, comment_id }) {
			return {
				success: true,
				data: instance._getComment(post_id, comment_id),
			};
		},
		'/comments/create': function (
			instance: FakerApi,
			{ post_id, comment: { content } }
		) {
			instance._setComment(post_id, { content });
			return {
				success: true,
				message: 'Comentario adicionado',
			};
		},
		'/comments/update': function (
			instance: FakerApi,
			{ post_id, comment_id, comment: { content } }
		) {
			const comment = instance._getComment(post_id, comment_id);
			comment.content = content;
			instance._setComment(post_id, comment);
			return {
				success: true,
				message: 'Comentario atualizado',
			};
		},
		'/comments/remove': function (instance: FakerApi, { post_id, comment_id }) {
			instance._removeComment(post_id, comment_id);
			return {
				success: true,
				message: 'Comentario removido',
			};
		},
	};
	getRoute(route: string) {
		const routeFunction = this.routes[route];
		if (typeof routeFunction !== 'function') {
			return () => {
				return {
					success: false,
					message: 'Rota não existe',
				};
			};
		}
		return (params: any) => {
			try {
				return routeFunction(this, params);
			} catch (e) {
				return {
					success: false,
					message: e,
				};
			}
		};
	}
	request(route: string, params: any) {
		const routeFunction = this.getRoute(route);
		return new Promise(function (resolve, reject) {
			window.setTimeout(function () {
				const response = routeFunction(params);
				if (response.success) {
					resolve(response);
					return;
				}
				reject(response);
			}, Math.random() * 200 + 150);
		});
	}
	get(route: string, params: any) {
		return this.request(route, params);
	}
	post(route: string, params: any) {
		return this.request(route, params);
	}
	put(route: string, params: any) {
		return this.request(route, params);
	}
	delete(route: string, params: any) {
		return this.request(route, params);
	}

	/**
	 * User Section
	 * @returns {any|*[]}
	 * @private
	 */
	_allUsers() {
		return JSON.parse(window.localStorage.getItem('users')) || [];
	}
	_getNextUserId() {
		return parseInt(window.localStorage.getItem('nextUserId')) || 1;
	}
	_addNextUserId() {
		window.localStorage.setItem(
			'nextUserId',
			String(this._getNextUserId() + 1)
		);
	}
	_insertUsers(users: any) {
		window.localStorage.setItem('users', JSON.stringify(users));
	}
	_getUser(user_id: any) {
		const users = this._allUsers();
		return users.filter((item) => item.id === user_id)[0];
	}
	_getUserByUsername(username: string) {
		const users = this._allUsers();
		return users.filter((item) => item.username === username)[0];
	}
	_setUser(user: any) {
		let users = this._allUsers();
		if (!user.id) {
			user.id = this._getNextUserId();
			users.push(user);
			this._addNextUserId();
		} else {
			users = users.map((postMap) => (postMap.id === user.id ? user : postMap));
		}
		this._insertUsers(users);
	}
	_getAuth() {
		return JSON.parse(window.localStorage.getItem('auth'));
	}
	_isAuthenticate() {
		if (!this._getAuth()) {
			throw 'Necessario autenticação';
		}
		return true;
	}
	_setAuth(user: any) {
		window.localStorage.setItem('auth', JSON.stringify(user));
	}
	_logout() {
		window.localStorage.removeItem('auth');
	}
	_auth(username: string, password: string) {
		const user = this._getUserByUsername(username);
		if (!user) {
			throw 'Usuario não encontrado';
		}
		if (user.password !== password) {
			throw 'Usuario ou senha divergentes';
		}
		this._setAuth(user);
		return true;
	}

	/**
	 * Posts Section
	 * @returns {any|*[]}
	 * @private
	 */
	_allPosts() {
		return JSON.parse(window.localStorage.getItem('posts')) || [];
	}
	_getNextPostId() {
		return parseInt(window.localStorage.getItem('nextPostId')) || 1;
	}
	_addNextPostId() {
		window.localStorage.setItem(
			'nextPostId',
			String(this._getNextPostId() + 1)
		);
	}
	_insertPosts(posts: any) {
		window.localStorage.setItem('posts', JSON.stringify(posts));
	}
	_getPost(post_id: any) {
		const posts = this._allPosts();
		const post = posts.filter((item) => item.id === post_id)[0];
		if (!post) throw 'Post não encontrado';
		if (!Array.isArray(post.comments)) {
			post.comments = [];
		}
		return post;
	}
	_setPost(post: any) {
		this._isAuthenticate();
		const auth = this._getAuth();
		let posts = this._allPosts();
		if (!post.id) {
			post.id = this._getNextPostId();
			post.user_id = auth.id;
			posts.push(post);
			this._addNextPostId();
		} else {
			posts = posts.map((postMap) =>
				postMap.id === post.id && postMap.user_id === auth.id ? post : postMap
			);
		}
		this._insertPosts(posts);
	}
	_removePost(post_id: any) {
		this._isAuthenticate();
		const auth = this._getAuth();
		const post = this._getPost(post_id);
		if (post.user_id !== auth.id) return;
		const posts = this._allPosts().filter((postMap) => postMap.id !== post_id);
		this._insertPosts(posts);
	}

	/**
	 * Comment Section
	 * @param post_id
	 * @returns {*[]}
	 * @private
	 */
	_getComments(post_id: any) {
		const post = this._getPost(post_id);
		return post.comments || [];
	}
	_getNextCommentId() {
		return parseInt(window.localStorage.getItem('nextCommentId')) || 1;
	}
	_addNextCommentId() {
		window.localStorage.setItem(
			'nextCommentId',
			String(this._getNextCommentId() + 1)
		);
	}
	_setComment(post_id: any, comment: any) {
		this._isAuthenticate();
		const auth = this._getAuth();
		const post = this._getPost(post_id);
		if (!comment.id) {
			comment.id = this._getNextCommentId();
			comment.user_id = auth.id;
			post.comments.push(comment);
			this._addNextCommentId();
		} else {
			post.comments = post.comments.map((commentMap) =>
				commentMap.id === comment.id && commentMap.user_id === auth.id
					? comment
					: commentMap
			);
		}
		this._setPost(post);
	}
	_getComment(post_id: any, comment_id: any) {
		const comments = this._getComments(post_id);
		const comment = comments.filter((item) => item.id === comment_id)[0];
		if (!comment) throw 'Post não encontrado';
		return comment;
	}
	_removeComment(post_id: any, comment_id: any) {
		this._isAuthenticate();
		const auth = this._getAuth();
		const post = this._getPost(post_id);
		const comment = this._getComment(post_id, comment_id);
		if (post.user_id !== auth.id || comment.user_id !== auth.id) return;
		post.comments = post.comments.filter(
			(commentMap) => commentMap.id !== comment_id
		);
		this._setPost(post);
	}
}
