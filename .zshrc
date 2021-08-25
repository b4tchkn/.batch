# Source Prezto.
if [[ -s "${ZDOTDIR:-$HOME}/.zprezto/init.zsh" ]]; then
  source "${ZDOTDIR:-$HOME}/.zprezto/init.zsh"
fi

# Customize to your needs...
export LSCOLORS=gxfxcxdxbxegedabagacad

autoload -Uz compinit
compinit

alias la='ls -a'
alias ll='ls -l'
alias g='git'
alias gs='git status'
alias gsl='git stash list'
alias gss='git stash save'

# run ll after run cd
chpwd() {
    if [[ $(pwd) != $HOME ]]; then;
        ls
    fi
}

# For Flutter
export PATH="$PATH:/Users/kakerunakabachi/Development/flutter/bin"
export PATH="$HOME/.rbenv/bin:$PATH"
if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi
