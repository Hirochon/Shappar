import os
from datetime import timedelta
import environ

env = environ.Env(DEBUG=(bool,False),ALLOWED_HOSTS=(list,[]))

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

SECRET_KEY = 'ts*b*i0^-8+m@%6151^ko6=a6o0s7om^!*#1)$^fc0fehnj*m2'
DEBUG = True
ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # カスタムユーザ
    'accounts.apps.AccountsConfig',

    # API application
    'apiv1.apps.Apiv1Config',

    # allauth
    'django.contrib.sites',             #allauthではサイトを識別するsiteフレームワークが必須なためインストール
    'allauth',                          #allauthアプリ
    'allauth.account',                  #allauthの基本的なログイン認証系
    'allauth.socialaccount',            #ソーシャル認証

    # 3rd party apps
    'rest_framework',                   #RESTFrameworkアプリ
    'djoser',                           #エンドポイントを設定
    'django_filters',                   #フィルタリング
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]


ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
            os.path.join(BASE_DIR, 'templates', 'allauth'),
            ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi_circleci.application'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}


# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'ja'

TIME_ZONE = 'Asia/Tokyo'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)

# STATIC_URL = 'https://d3ms402csqm2a0.cloudfront.net/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
# STATIC_ROOT = 'https://d3ms402csqm2a0.cloudfront.net/static/'

MEDIA_URL = 'https://%s/media/' % env('AWS_S3_CUSTOM_DOMAIN')
MEDIA_ROOT = 'https://%s/media/' % env('AWS_S3_CUSTOM_DOMAIN')

# Media Files

# # MEDIA_URL = 'https://d3ms402csqm2a0.cloudfront.net/media/'
# MEDIA_ROOT = 'https://d3ms402csqm2a0.cloudfront.net/media/'

MEDIA_URL = 'https://%s/media/' % env('AWS_S3_CUSTOM_DOMAIN')
MEDIA_ROOT = 'https://%s/media/' % env('AWS_S3_CUSTOM_DOMAIN')

###########################
# Authentication(allauth) #
###########################

SITE_ID = 1     #サイトの識別ID
LOGIN_REDIRECT_URL = 'home'         #ログイン後のリダイレクト先
LOGOUT_REDIRECT_URL = '/accounts/login/'    #ログアウト後のリダイレクト先
AUTH_USER_MODEL = 'accounts.CustomUser'     #カスタムユーザーモデルの定義
ACCOUNT_FORMS = {'signup': 'accounts.forms.MyCustomSignupForm'}    #カスタムフォームの定義
ACCOUNT_EMAIL_REQUIRED = True      # 登録時にメールアドレスを必須項目にする。
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',                # デフォルトの設定
    'allauth.account.auth_backends.AuthenticationBackend',      # allauthの認証方式
)
ACCOUNT_ADAPTER = 'accounts.adapter.CustomAccountAdapter'


##################
# REST Framework #
##################

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES':[
        'rest_framework_simplejwt.authentication.JWTAuthentication'
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_FILTER_BACKENDS': ('django_filters.rest_framework.DjangoFilterBackend',)
}

SIMPLE_JWT = {
    'AUTH_HEADER_TYPES':('JWT',),
    'ACCESS_TOKEN_LIFETIME':timedelta(minutes=180),
}


if DEBUG:
    LOGGING = {
        'version' : 1,                          #バージョンは1に固定
        'disable_existing_loggers' : False,     #既存のログ設定を無効化しない

        #ログフォーマット
        'formatters' : {
            #開発用
            'develop' : {
                'format' : '%(asctime)s [%(levelname)s] %(pathname)s:%(lineno)d %(message)s'
            },
        },
        #ハンドラ
        'handlers' : {
            #コンソール出力用ハンドラ
            'console' : {
                'level' : 'DEBUG',
                'class' : 'logging.StreamHandler',
                'formatter' : 'develop',
            },
        },
        #ロガー
        'loggers' : {
            #自作アプリケーション全般のログを拾うロガー
            '' : {
                'handlers' : ['console'],
                'level' : 'DEBUG',
                'propagate' : False,
            },
            #Django本体が出すログ全般を拾うロガー
            'django' : {
                'handlers' : ['console'],
                'level' : 'INFO',
                'propagate' : False,
            },
            #発行されるSQL文を出力するための設定
            'django.db.backends' : {
                'handlers' : ['console'],
                'level' : 'DEBUG',
                'propagate' : False,
            },
        },
    }
else:
    LOGGING = {
        'version' : 1,                          #バージョンは1に固定
        'disable_existing_loggers' : False,     #既存のログ設定を無効化しない

        #ログフォーマット
        'formatters' : {
            #開発用
            'production' : {
                'format' : '%(asctime)s [%(levelname)s] %(process)d %(thread)d %(pathname)s:%(lineno)d %(message)s'
            },
        },
        #ハンドラ
        'handlers' : {
            #コンソール出力用ハンドラ
            'console' : {
                'level' : 'INFO',
                'class' : 'logging.StreamHandler',
                'formatter' : 'production',
            },
        },
        #ロガー
        'loggers' : {
            #自作アプリケーション全般のログを拾うロガー
            '' : {
                'handlers' : ['console'],
                'level' : 'INFO',
                'propagate' : False,
            },
            #Django本体が出すログ全般を拾うロガー
            'django' : {
                'handlers' : ['console'],
                'level' : 'INFO',
                'propagate' : False,
            },
            #発行されるSQL文を出力するための設定
            'django.db.backends' : {
                'handlers' : ['console'],
                'level' : 'INFO',
                'propagate' : False,
            },
        },
    }