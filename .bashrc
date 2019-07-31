# .bashrc

# エイリアスの設定
# ls（カラー表示）
alias ls='ls -G'
alias ll='ls -lG'
alias la='ls -laG'

# define for PS1
black=$'\e[30m' # Black - Regular
red=$'\e[31m' # Red
green=$'\e[32m' # Green
yellow=$'\e[33m' # Yellow
blue=$'\e[34m' # Blue
purple=$'\e[35m' # Purple
cyan=$'\e[36m' # Cyan
white=$'\e[37m' # White


# プロンプトの設定
#PS1='\[\e[34m\]\w \[\e[37m\]\$\[\e[0m\] '
#PS1='\[$blue\]\u'
#PS1="\u:\t \W $" # ユーザー名:時間 ディレクトリ名 $

#PS1='\w\$'

## Go 環境設定
if [ -x "`which go`" ]; then
    export GOPATH=$HOME/.go
    export PATH=$PATH:$GOPATH/bin
fi

#node.js
export PATH=$PATH:/Users/kakerunakabachi/.nodebrew/current/bin
