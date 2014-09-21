Ext
		.define(
				'Horizon.view.login.Login',
				{
					extend : 'Ext.window.Window',
					xtype : 'login',

					requires : [ 'Horizon.view.login.LoginController',
							'Ext.form.Panel' ],

					controller : 'login',
					bodyPadding : 10,
					title : 'Login Window',
					closable : false,
					autoShow : true,

					items : {
						xtype : 'form',
						reference : 'form',
						jsonSubmit : true,
						defaults : {
							listeners : {
								specialkey : function(field, event, options) {
									// Enable submitting with enter in field
									if (event.getKey() == event.ENTER) {
										var loginBtn = field.up('form').down(
												'button#loginBtn');
										if (loginBtn.disabled == false)
											loginBtn.fireHandler();
									}
								}
							}
						},
						items : [ {
							xtype : 'textfield',
							name : 'username',
							fieldLabel : 'Username',
							allowBlank : false
						}, {
							xtype : 'textfield',
							name : 'password',
							inputType : 'password',
							fieldLabel : 'Password',
							allowBlank : false
						}, {
							xtype : 'displayfield',
							hideEmptyLabel : false,
							value : 'Enter any non-blank password'
						} ],
						buttons : [ {
							text : 'Login',
							itemId : 'loginBtn',
							formBind : true,
							handler : 'onLogin'
						} ]
					}
				});